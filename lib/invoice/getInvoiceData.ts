import { SupabaseClient } from "@supabase/supabase-js";
import { InvoiceData, InvoiceItem, CustomerInformation } from "./invoiceTypes";
import { DEFAULT_COMPANY_INFO } from "./constants";

/**
 * Step 1 — Fetch Order Data and format into InvoiceData
 *
 * Responsibilities:
 * - Fetches order record from Supabase `orders` table
 * - Fetches snapshot item details from `order_items` table
 * - Prepares and returns a strongly-typed InvoiceData structure
 * - Does NOT generate PDF or upload anything
 */
export async function getInvoiceData(
  supabase: SupabaseClient,
  orderId: string
): Promise<InvoiceData> {
  if (!orderId) {
    throw new Error("[getInvoiceData] Order ID is required");
  }

  // 1. Fetch Order Record
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select(`
      id,
      invoice_number,
      total,
      status,
      payment_status,
      created_at,
      paid_at,
      shipping_address,
      user_id,
      profiles (
        full_name,
        id
      )
    `)
    .eq("id", orderId)
    .single();

  if (orderError || !order) {
    console.error("[getInvoiceData] Order query failed:", orderError);
    throw new Error(`Order not found for ID: ${orderId}`);
  }

  // 2. Fetch Order Items (using immutable snapshot columns)
  const { data: orderItems, error: itemsError } = await supabase
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

  if (itemsError || !orderItems) {
    console.error("[getInvoiceData] Order items query failed:", itemsError);
    throw new Error(`Failed to fetch items for order ID: ${orderId}`);
  }

  // 3. Map Snapshot Order Items
  const invoiceItems: InvoiceItem[] = orderItems.map((item: any) => ({
    productName: item.product_name || "SCHAULT Modular Product",
    sku: item.product_sku || "N/A",
    size: item.product_size || "Standard",
    color: item.product_color || null,
    quantity: Number(item.quantity) || 1,
    unitPrice: Number(item.unit_price) || 0,
    lineTotal: Number(item.line_total) || (Number(item.quantity || 1) * Number(item.unit_price || 0)),
  }));

  // 4. Map Customer Information
  const shipping = (order.shipping_address as Record<string, any>) || {};
  const profileName = Array.isArray(order.profiles)
    ? (order.profiles[0] as any)?.full_name
    : (order.profiles as any)?.full_name;

  const customer: CustomerInformation = {
    name: shipping.full_name || profileName || "Valued Customer",
    email: shipping.email || "customer@schault.com",
    phone: shipping.phone || "",
    shippingAddress: {
      line1: shipping.line1 || "N/A",
      line2: shipping.line2 || undefined,
      city: shipping.city || "N/A",
      state: shipping.state || undefined,
      postalCode: shipping.postal_code || shipping.postalCode || "",
      country: shipping.country || "India",
    },
  };

  // 5. Format Dates
  const formattedInvoiceDate = new Date(order.created_at || Date.now()).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const formattedPaymentDate = order.paid_at
    ? new Date(order.paid_at).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : formattedInvoiceDate;

  const totalAmount = Number(order.total) || 0;
  const computedSubtotal = invoiceItems.reduce((sum, item) => sum + item.lineTotal, 0);
  // Discount is the gap between line-item subtotal and the amount actually charged.
  const discountAmount = computedSubtotal > totalAmount ? computedSubtotal - totalAmount : 0;

  return {
    invoiceNumber: order.invoice_number || `INV-${order.id.slice(0, 8).toUpperCase()}`,
    orderId: order.id,
    invoiceDate: formattedInvoiceDate,
    paymentDate: formattedPaymentDate,
    paymentStatus: (order.payment_status || "PAID").toUpperCase(),
    paymentMethod: "Razorpay (Online Payment)",
    company: DEFAULT_COMPANY_INFO,
    customer,
    items: invoiceItems,
    subtotal: computedSubtotal > 0 ? computedSubtotal : totalAmount,
    shippingFee: 0,
    discountAmount,
    taxAmount: 0,
    grandTotal: totalAmount > 0 ? totalAmount : computedSubtotal,
  };
}
