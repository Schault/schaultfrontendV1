import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { createClient } from "@/utils/supabase/server";
import { computeOrderPricing } from "@/lib/orders/pricing";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID ?? process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: Request) {
  try {
    const { items, coupon } = await req.json();

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const supabase = createClient();
    if (!supabase) {
      return NextResponse.json(
        { error: "Database configuration missing" },
        { status: 500 }
      );
    }

    // Price is computed from the database — the client never dictates the amount.
    const { total } = await computeOrderPricing(supabase, items, coupon);
    const amountInPaise = Math.round(total * 100);

    if (amountInPaise < 100) {
      return NextResponse.json(
        { error: "Order total must be at least 1 INR" },
        { status: 400 }
      );
    }

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `rcpt_${Date.now()}`,
    });

    return NextResponse.json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (err: any) {
    console.error("Razorpay create-order error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
