import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";

async function createDelhiveryShipment(orderId: string, total: number, address: {
  full_name: string; line1: string; line2?: string;
  city: string; state: string; postal_code: string; phone: string;
}) {
  const res = await fetch("https://track.delhivery.com/api/cmu/create.json", {
    method: "POST",
    headers: {
      "Authorization": `Token ${process.env.DELHIVERY_API_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
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
    }),
  });

  if (!res.ok) return null;
  const data = await res.json();
  return data?.packages?.[0]?.waybill ?? null;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, order_data } = body;

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

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Create order in Supabase
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        status: "confirmed",
        total: order_data?.total ?? 0,
        shipping_address: order_data?.shipping_address ?? null,
        razorpay_payment_id,
      })
      .select("id")
      .single();

    if (orderError || !order) {
      console.error("Order insert error:", orderError);
      return NextResponse.json({ error: "Failed to save order" }, { status: 500 });
    }

    // Create Delhivery shipment (non-fatal if it fails)
    let waybill: string | null = null;
    try {
      if (order_data?.shipping_address) {
        waybill = await createDelhiveryShipment(order.id, order_data.total, order_data.shipping_address);
      }
    } catch (e) {
      console.error("Delhivery shipment error:", e);
    }

    if (waybill) {
      await supabase
        .from("orders")
        .update({ waybill, status: "processing" })
        .eq("id", order.id);
    }

    return NextResponse.json({ success: true, payment_id: razorpay_payment_id, order_id: order.id });
  } catch (err) {
    console.error("Razorpay verify-payment error:", err);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
