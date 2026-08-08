import { NextResponse } from "next/server";
import crypto from "crypto";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createOrderPipeline } from "@/lib/orders/create-order-pipeline";
import { computeOrderPricing } from "@/lib/orders/pricing";
import { uploadInvoice } from "@/lib/invoice/uploadInvoice";
import { sendOrderConfirmation } from "@/lib/email/sendOrderConfirmation";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function createDelhiveryShipment(orderId: string, total: number, address: {
  full_name: string; line1: string; line2?: string;
  city: string; state: string; postal_code: string; phone: string;
}) {
  const payload = JSON.stringify({
    shipments: [{
      name: address.full_name,
      add: [address.line1, address.line2].filter(Boolean).join(", "),
      pin: address.postal_code,
      city: address.city,
      state: address.state,
      country: "India",
      phone: address.phone,
      order: orderId,
      payment_mode: "Prepaid",
      return_pin: "", return_city: "", return_phone: "",
      return_name: "", return_add: "", return_state: "", return_country: "",
      products_desc: "Shoes",
      hsn_code: "",
      cod_amount: "0",
      total_amount: String(total),
      seller_name: "Schault",
      seller_add: "", seller_inv: "",
      quantity: "1",
      waybill: "",
      shipment_length: 30, shipment_width: 20, shipment_height: 15,
      weight: 0.5,
      seller_gst_tin: "",
      shipping_mode: "Surface",
      address_type: "home",
    }],
    pickup_location: { name: process.env.DELHIVERY_WAREHOUSE_NAME },
  });

  const res = await fetch("https://track.delhivery.com/api/cmu/create.json", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.DELHIVERY_API_TOKEN}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `format=json&data=${encodeURIComponent(payload)}`,
  });

  const data = await res.json();
  console.log("Delhivery response:", JSON.stringify(data));
  if (!res.ok) return null;
  return data?.packages?.[0]?.waybill ?? null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shipping_address,
      coupon,
    } = body;

    // 1. Verify Razorpay Signature
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    // 2. Authenticate User
    const supabase = createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database configuration missing" },
        { status: 500 }
      );
    }

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: User session required" },
        { status: 401 }
      );
    }

    // 3. Delegate to Order Pipeline if items are provided
    if (items && Array.isArray(items) && items.length > 0) {
      // Recompute prices from the database — never trust client-supplied amounts.
      const { items: pricedItems, total } = await computeOrderPricing(
        supabase,
        items,
        coupon
      );

      // Cross-check against what Razorpay actually charged, so a tampered cart
      // (different items than create-order) cannot be recorded as paid.
      const rzpOrder = await razorpay.orders.fetch(razorpay_order_id);
      const expectedPaise = Math.round(total * 100);
      if (Number(rzpOrder.amount) !== expectedPaise) {
        return NextResponse.json(
          { error: "Order total does not match the amount paid" },
          { status: 400 }
        );
      }

      // Step A: Create Order & decrement stock atomically via PostgreSQL RPC
      const orderResult = await createOrderPipeline(supabase, {
        user_id: user.id,
        razorpay_order_id,
        razorpay_payment_id,
        total,
        shipping_address: shipping_address || {},
        items: pricedItems,
      });

      // Step B: Create Delhivery shipment (non-fatal). Uses the server-computed
      // total and the order created above.
      let waybill: string | null = null;
      try {
        if (shipping_address) {
          waybill = await createDelhiveryShipment(orderResult.order_id, total, shipping_address);
        }
      } catch (e) {
        console.error("[verify-payment] Delhivery shipment error (non-fatal):", e);
      }

      if (waybill) {
        await adminSupabase
          .from("orders")
          .update({ waybill, status: "processing" })
          .eq("id", orderResult.order_id);
      }

      // Step C: Upload Invoice PDF to Supabase Storage (non-blocking for payment response)
      let invoiceResult: any = null;
      try {
        // service-role: the private `invoices` bucket has no storage RLS policy,
        // so the user client can't upload. Ownership is already established by the pipeline.
        invoiceResult = await uploadInvoice(adminSupabase, orderResult.order_id);
      } catch (uploadErr) {
        console.error("[verify-payment] Invoice upload error (non-fatal):", uploadErr);
      }

      // Step D: Send Transactional Order Confirmation Email via Resend (non-blocking for payment response)
      try {
        await sendOrderConfirmation(supabase, orderResult.order_id);
      } catch (emailErr) {
        console.error("[verify-payment] Email sending error (non-fatal):", emailErr);
      }

      return NextResponse.json({
        success: true,
        payment_id: razorpay_payment_id,
        order_id: orderResult.order_id,
        order: {
          id: orderResult.order_id,
          invoice_number: orderResult.invoice_number,
          invoice_url: invoiceResult?.invoiceUrl || null,
          waybill,
          status: waybill ? "processing" : orderResult.status,
          payment_status: orderResult.payment_status,
        },
      });
    }

    // Fallback response if only signature verification was requested
    return NextResponse.json({
      success: true,
      payment_id: razorpay_payment_id,
    });
  } catch (err: any) {
    console.error("Razorpay verify-payment error:", err);
    return NextResponse.json(
      { error: err?.message || "Verification failed" },
      { status: 500 }
    );
  }
}
