import { NextResponse } from "next/server";
import crypto from "crypto";
import { waitUntil } from "@vercel/functions";
import { finalizePayment, fulfillOrder, getPendingPayment } from "@/lib/orders/finalize-payment";

// Cashfree signs base64(HMAC-SHA256(timestamp + rawBody, secretKey)).
function isValidSignature(timestamp: string, rawBody: string, signature: string) {
  const expected = crypto
    .createHmac("sha256", process.env.CASHFREE_SECRET_KEY!)
    .update(timestamp + rawBody)
    .digest("base64");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

/**
 * Backup path for a paid order when the customer's browser never reaches
 * /api/payments/verify (tab closed, back pressed, network drop).
 * Non-2xx makes Cashfree retry, so only real failures return 500.
 */
export async function POST(req: Request) {
  const rawBody = await req.text();
  const timestamp = req.headers.get("x-webhook-timestamp");
  const signature = req.headers.get("x-webhook-signature");

  if (!timestamp || !signature || !isValidSignature(timestamp, rawBody, signature)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let event: any;
  try {
    event = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const gatewayOrderId = event?.data?.order?.order_id;
  if (event?.type !== "PAYMENT_SUCCESS_WEBHOOK" || !gatewayOrderId) {
    return NextResponse.json({ ignored: true });
  }

  try {
    const pending = await getPendingPayment(gatewayOrderId);
    if (!pending) {
      // Not created by this site (e.g. a Dev Studio test order): acknowledge, don't retry.
      return NextResponse.json({ ignored: true });
    }

    const orderResult = await finalizePayment(pending);
    if (!orderResult.is_duplicate) {
      waitUntil(fulfillOrder(orderResult.order_id, Number(pending.total), pending.shipping_address));
    }
    return NextResponse.json({ success: true, order_id: orderResult.order_id });
  } catch (err: any) {
    console.error("[webhook] Payment finalize error:", err);
    return NextResponse.json({ error: err?.message || "Webhook processing failed" }, { status: 500 });
  }
}
