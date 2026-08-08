import { createClient } from "@/utils/supabase/server";
import { OrderListItem, OrderStatus } from "@/lib/types/order";

/**
 * Server Helper: Fetch all orders belonging to the authenticated user.
 * Enforces ownership security at the database query level (eq("user_id", user.id)).
 */
export async function getOrders(): Promise<OrderListItem[]> {
  const supabase = createClient();
  if (!supabase) return [];

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return [];
  }

  const { data, error } = await supabase
    .from("orders")
    .select(`
      id,
      invoice_number,
      status,
      payment_status,
      total,
      created_at,
      estimated_delivery,
      order_items (
        id,
        quantity,
        product_name,
        product_image
      )
    `)
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error("[getOrders] Query error:", error);
    return [];
  }

  return data.map((order: any) => {
    const items = order.order_items || [];
    const firstItem = items[0] || {};
    const itemCount = items.reduce(
      (sum: number, item: any) => sum + (Number(item.quantity) || 1),
      0
    );

    return {
      id: order.id,
      invoice_number: order.invoice_number || null,
      status: (order.status as OrderStatus) || "confirmed",
      payment_status: (order.payment_status || "paid").toUpperCase(),
      total: Number(order.total) || 0,
      created_at: order.created_at,
      estimated_delivery: order.estimated_delivery || null,
      item_count: itemCount > 0 ? itemCount : items.length,
      first_item_image: firstItem.product_image || null,
      first_item_name: firstItem.product_name || "SCHAULT Shoe",
    };
  });
}
