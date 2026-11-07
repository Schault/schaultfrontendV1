import { NextResponse } from "next/server";
import { waitUntil } from "@vercel/functions";
import { createClient } from "@/utils/supabase/server";
import { finalizePayment, fulfillOrder, getPendingPayment } from "@/lib/orders/finalize-payment";

export async function POST(req: Request) {
  try {
    const { order_id: gatewayOrderId } = await req.json();

    if (!gatewayOrderId) {
      return NextResponse.json({ error: "Missing payment verification fields" }, { status: 400 });
    }

    // 1. Authenticate User
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

    // 2. Load the server-side cart snapshot saved at create-order — the client never sends the cart here.
    const pending = await getPendingPayment(gatewayOrderId);
    if (!pending || pending.user_id !== user.id) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // 3. Verify with Cashfree and create the order (idempotent; the webhook may have done it already).
    const orderResult = await finalizePayment(pending);

    // 4. Shipment, invoice and email run after the response so the customer isn't kept waiting.
    if (!orderResult.is_duplicate) {
      waitUntil(fulfillOrder(orderResult.order_id, Number(pending.total), pending.shipping_address));
    }

    return NextResponse.json({
      success: true,
      order_id: orderResult.order_id,
    });
  } catch (err: any) {
    console.error("Payment verify error:", err);
    return NextResponse.json(
      { error: err?.message || "Verification failed" },
      { status: 500 }
    );
  }
}
