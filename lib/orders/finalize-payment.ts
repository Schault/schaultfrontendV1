import { createClient as createAdminClient } from "@supabase/supabase-js";
import { createOrderPipeline, CreateOrderPipelineResult } from "@/lib/orders/create-order-pipeline";
import { cashfree } from "@/lib/payments/gateway";
import { uploadInvoice } from "@/lib/invoice/uploadInvoice";
import { sendOrderConfirmation } from "@/lib/email/sendOrderConfirmation";
import { createDelhiveryShipment, DelhiveryAddress } from "@/lib/shipping/delhivery";

// service-role: pending_payments has no RLS policies and the webhook has no user session.
export const adminSupabase = createAdminClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export interface PendingPayment {
  gateway_order_id: string;
  gateway: string;
  user_id: string;
  items: any[];
  total: number;
  shipping_address: DelhiveryAddress & Record<string, unknown>;
}

export async function getPendingPayment(gatewayOrderId: string): Promise<PendingPayment | null> {
  const { data, error } = await adminSupabase
    .from("pending_payments")
    .select("gateway_order_id, gateway, user_id, items, total, shipping_address")
    .eq("gateway_order_id", gatewayOrderId)
    .maybeSingle();
  if (error) throw new Error(`Failed to load pending payment: ${error.message}`);
  return data as PendingPayment | null;
}

/**
 * Confirms the payment with Cashfree and creates the order from the server-side
 * cart snapshot. Safe to call from both checkout verify and the webhook: the RPC
 * is idempotent on (gateway, gateway_order_id), and a concurrent duplicate insert
 * (unique index) is resolved by returning the order that won.
 */
export async function finalizePayment(pending: PendingPayment): Promise<CreateOrderPipelineResult> {
  const path = `/orders/${encodeURIComponent(pending.gateway_order_id)}`;
  const cfOrder = await cashfree<{ order_status: string; order_amount: number }>(path);

  if (cfOrder.order_status !== "PAID") {
    throw new Error("Payment not completed");
  }
  if (Math.round(Number(cfOrder.order_amount) * 100) !== Math.round(Number(pending.total) * 100)) {
    throw new Error("Order total does not match the amount paid");
  }

  const payments = await cashfree<{ cf_payment_id: string | number; payment_status: string }[]>(
    `${path}/payments`
  );
  const successPayment = payments.find((p) => p.payment_status === "SUCCESS");
  if (!successPayment) {
    throw new Error("No successful payment found");
  }

  try {
    return await createOrderPipeline(adminSupabase, {
      user_id: pending.user_id,
      gateway: pending.gateway,
      gateway_order_id: pending.gateway_order_id,
      gateway_payment_id: String(successPayment.cf_payment_id),
      total: Number(pending.total),
      shipping_address: pending.shipping_address,
      items: pending.items,
    });
  } catch (err) {
    // Lost a race with the other caller (verify vs webhook): return the order it created.
    const { data: existing } = await adminSupabase
      .from("orders")
      .select("id, invoice_number, payment_status, status, created_at, total")
      .eq("payment_gateway", pending.gateway)
      .eq("gateway_order_id", pending.gateway_order_id)
      .maybeSingle();
    if (!existing) throw err;
    return {
      order_id: existing.id,
      invoice_number: existing.invoice_number,
      payment_status: existing.payment_status,
      status: existing.status,
      created_at: existing.created_at,
      total: Number(existing.total),
      is_duplicate: true,
    };
  }
}

/**
 * Post-order side effects: Delhivery shipment, invoice PDF, confirmation email.
 * Each step is non-fatal. Runs after the response is sent (waitUntil), so the
 * customer isn't left waiting on third-party APIs.
 * ponytail: no retry if a step fails here; add a retry job if logs show failures.
 */
export async function fulfillOrder(orderId: string, total: number, address: DelhiveryAddress) {
  try {
    const waybill = await createDelhiveryShipment(orderId, total, address);
    if (waybill) {
      await adminSupabase
        .from("orders")
        .update({ waybill, status: "processing" })
        .eq("id", orderId);
    }
  } catch (e) {
    console.error("[fulfillOrder] Delhivery shipment error (non-fatal):", e);
  }

  try {
    // Invoice must exist before the email, which links to it.
    await uploadInvoice(adminSupabase, orderId);
  } catch (e) {
    console.error("[fulfillOrder] Invoice upload error (non-fatal):", e);
  }

  try {
    await sendOrderConfirmation(adminSupabase, orderId);
  } catch (e) {
    console.error("[fulfillOrder] Email sending error (non-fatal):", e);
  }
}
