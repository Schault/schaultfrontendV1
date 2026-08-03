import { createClient } from "@/utils/supabase/server";
import { OrderDetail, OrderItemDetail, OrderStatus, TimelineEntry } from "@/lib/types/order";

/**
 * Server Helper: Fetch complete order details for a specific order.
 * SECURITY: Enforces strict user ownership (eq("user_id", user.id) AND eq("id", orderId)).
 * Returns null if unauthenticated, missing, or unauthorized (preventing order existence disclosure).
 */
export async function getOrderDetails(orderId: string): Promise<OrderDetail | null> {
  if (!orderId) return null;

  const supabase = createClient();
  if (!supabase) return null;

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return null;
  }

  // 1. Fetch order with ownership filter
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      id,
      invoice_number,
      invoice_url,
      invoice_generated_at,
      status,
      payment_status,
      razorpay_order_id,
      razorpay_payment_id,
      total,
      created_at,
      paid_at,
      estimated_delivery,
      shipping_address,
      updated_at
    `)
    .eq("id", orderId)
    .eq("user_id", user.id)
    .single();

  if (orderError || !order) {
    return null; // Triggers notFound() without revealing if order exists
  }

  // 2. Fetch order items (using immutable snapshots)
  const { data: itemsData, error: itemsError } = await supabase
    .from("order_items")
    .select(`
      id,
      quantity,
      unit_price,
      line_total,
      product_name,
      product_image,
      product_sku,
      product_size,
      product_color
    `)
    .eq("order_id", orderId);

  if (itemsError) {
    console.error("[getOrderDetails] Error fetching order items:", itemsError);
  }

  // 3. Fetch status history timeline
  const { data: historyData, error: historyError } = await supabase
    .from("order_status_history")
    .select(`
      id,
      status,
      note,
      created_at
    `)
    .eq("order_id", orderId)
    .order("created_at", { ascending: true });

  if (historyError) {
    console.error("[getOrderDetails] Error fetching status history:", historyError);
  }

  // 4. Map Snapshot Items
  const formattedItems: OrderItemDetail[] = (itemsData || []).map((item: any) => ({
    id: item.id,
    quantity: Number(item.quantity) || 1,
    unit_price: Number(item.unit_price) || 0,
    line_total: Number(item.line_total) || (Number(item.quantity || 1) * Number(item.unit_price || 0)),
    product_name: item.product_name || "SCHAULT Modular Product",
    product_image: item.product_image || null,
    variant_size: item.product_size || "Standard",
    variant_color: item.product_color || null,
    variant_sku: item.product_sku || "N/A",
  }));

  const timeline: TimelineEntry[] = (historyData || []).map((t: any) => ({
    id: t.id,
    status: (t.status as OrderStatus) || "confirmed",
    note: t.note || null,
    created_at: t.created_at,
  }));

  return {
    id: order.id,
    invoice_number: order.invoice_number || null,
    invoice_url: order.invoice_url || null,
    invoice_generated_at: order.invoice_generated_at || null,
    status: (order.status as OrderStatus) || "confirmed",
    payment_status: (order.payment_status || "paid").toUpperCase(),
    payment_method: "Razorpay (Online Payment)",
    razorpay_order_id: order.razorpay_order_id || null,
    razorpay_payment_id: order.razorpay_payment_id || null,
    total: Number(order.total) || 0,
    created_at: order.created_at,
    paid_at: order.paid_at || order.created_at,
    estimated_delivery: order.estimated_delivery || null,
    shipping_address: (order.shipping_address as any) || null,
    updated_at: order.updated_at || order.created_at,
    items: formattedItems,
    timeline,
  };
}
