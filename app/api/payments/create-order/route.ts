import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@/utils/supabase/server";
import { computeOrderPricing } from "@/lib/orders/pricing";
import { cashfree, CASHFREE_MODE } from "@/lib/payments/gateway";

export async function POST(req: Request) {
  try {
    const { items, coupon, customer } = await req.json();

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

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized: User session required" },
        { status: 401 }
      );
    }

    // Price is computed from the database — the client never dictates the amount.
    const { total } = await computeOrderPricing(supabase, items, coupon);
    if (total < 1) {
      return NextResponse.json(
        { error: "Order total must be at least 1 INR" },
        { status: 400 }
      );
    }

    // Cashfree requires a 10-digit Indian mobile number.
    const phone = String(customer?.phone || "").replace(/\D/g, "").slice(-10);
    if (phone.length !== 10) {
      return NextResponse.json(
        { error: "Enter a valid 10-digit phone number" },
        { status: 400 }
      );
    }

    const order = await cashfree<{ order_id: string; payment_session_id: string }>(
      "/orders",
      {
        method: "POST",
        body: {
          order_id: `sch_${Date.now()}_${crypto.randomUUID().slice(0, 8)}`,
          order_amount: Math.round(total * 100) / 100,
          order_currency: "INR",
          customer_details: {
            customer_id: user.id,
            customer_phone: phone,
            customer_email: customer?.email || user.email || undefined,
            customer_name: customer?.name || undefined,
          },
        },
      }
    );

    return NextResponse.json({
      order_id: order.order_id,
      payment_session_id: order.payment_session_id,
      mode: CASHFREE_MODE,
    });
  } catch (err: any) {
    console.error("Cashfree create-order error:", err);
    return NextResponse.json(
      { error: err?.message || "Failed to create order" },
      { status: 500 }
    );
  }
}
