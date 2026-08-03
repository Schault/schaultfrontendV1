import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { createOrderPipeline } from "@/lib/orders/create-order-pipeline";
import { uploadInvoice } from "@/lib/invoice/uploadInvoice";
import { sendOrderConfirmation } from "@/lib/email/sendOrderConfirmation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      shipping_address,
      total,
    } = body;

    // 1. Verify Razorpay Signature
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: "Missing payment verification fields" },
        { status: 400 }
      );
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return NextResponse.json(
        { error: "Invalid payment signature" },
        { status: 400 }
      );
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
      // Step A: Create Order & decrement stock atomically via PostgreSQL RPC
      const orderResult = await createOrderPipeline(supabase, {
        user_id: user.id,
        razorpay_order_id,
        razorpay_payment_id,
        total: Number(total) || 0,
        shipping_address: shipping_address || {},
        items,
      });

      // Step B: Upload Invoice PDF to Supabase Storage (non-blocking for payment response)
      let invoiceResult: any = null;
      try {
        invoiceResult = await uploadInvoice(supabase, orderResult.order_id);
      } catch (uploadErr) {
        console.error("[verify-payment] Invoice upload error (non-fatal):", uploadErr);
      }

      // Step C: Send Transactional Order Confirmation Email via Resend (non-blocking for payment response)
      try {
        await sendOrderConfirmation(supabase, orderResult.order_id);
      } catch (emailErr) {
        console.error("[verify-payment] Email sending error (non-fatal):", emailErr);
      }

      return NextResponse.json({
        success: true,
        payment_id: razorpay_payment_id,
        order: {
          id: orderResult.order_id,
          invoice_number: orderResult.invoice_number,
          invoice_url: invoiceResult?.invoiceUrl || null,
          status: orderResult.status,
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
