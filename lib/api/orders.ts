import { createClient } from "@/utils/supabase/server";
import { OrderDetail, OrderListItem, TimelineEntry, OrderItemDetail, OrderStatus } from "@/lib/types/order";

export async function getMyOrders(): Promise<OrderListItem[]> {
  const supabase = createClient();
  if (!supabase) return [];
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
      throw new Error("Unauthorized");
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
      order_items (id)
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data || []).map((order: any) => ({
    id: order.id,
    invoice_number: order.invoice_number || null,
    status: order.status as OrderStatus,
    payment_status: (order.payment_status || "paid").toUpperCase(),
    total: order.total,
    created_at: order.created_at,
    estimated_delivery: order.estimated_delivery,
    item_count: order.order_items?.length || 0,
  }));
}

export async function getOrderById(orderId: string): Promise<OrderDetail> {
  const supabase = createClient();
  if (!supabase) throw new Error("Database configuration error");
  
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
      throw new Error("Unauthorized");
  }

  // Fetch the main order
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      id,
      invoice_number,
      invoice_url,
      invoice_generated_at,
      status,
      payment_status,
      total,
      created_at,
      estimated_delivery,
      shipping_address,
      updated_at,
      waybill
    `)
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    throw new Error("Order not found");
  }

  // Fetch the items with variants and products
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
      product_color,
      product_variants (
        size,
        color,
        sku,
        products (
          name,
          slug
        )
      )
    `)
    .eq("order_id", orderId);

  if (itemsError) {
    throw itemsError;
  }

  // Fetch the timeline history
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
    throw historyError;
  }

  // Format Items
  const formattedItems: OrderItemDetail[] = (itemsData || []).map((item: any) => ({
    id: item.id,
    quantity: item.quantity,
    unit_price: item.unit_price,
    line_total: item.line_total,
    product_name: item.product_name || item.product_variants?.products?.name || "Unknown Product",
    product_image: item.product_image || null,
    product_slug: item.product_variants?.products?.slug || "",
    variant_size: item.product_size || item.product_variants?.size || "",
    variant_color: item.product_color || item.product_variants?.color || null,
    variant_sku: item.product_sku || item.product_variants?.sku || "",
  }));

  return {
    id: order.id,
    invoice_number: order.invoice_number || null,
    invoice_url: order.invoice_url || null,
    invoice_generated_at: order.invoice_generated_at || null,
    status: order.status as OrderStatus,
    payment_status: (order.payment_status || "paid").toUpperCase(),
    total: order.total,
    created_at: order.created_at,
    estimated_delivery: order.estimated_delivery,
    shipping_address: order.shipping_address,
    updated_at: order.updated_at,
    waybill: order.waybill ?? null,
    items: formattedItems,
    timeline: (historyData as TimelineEntry[]) || [],
  };
}
