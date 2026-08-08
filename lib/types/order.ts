export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface ShippingAddress {
  full_name: string;
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postal_code: string;
  phone?: string;
  country?: string;
}

export interface TimelineEntry {
  id: string;
  status: OrderStatus;
  note: string | null;
  created_at: string;
}

export interface OrderItemDetail {
  id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  product_name: string;
  product_image?: string | null;
  variant_size: string;
  variant_color: string | null;
  variant_sku: string;
  product_slug?: string;
}

export interface OrderDetail {
  id: string;
  invoice_number: string | null;
  invoice_url: string | null;
  invoice_generated_at: string | null;
  status: OrderStatus;
  payment_status: string;
  payment_method?: string;
  razorpay_order_id?: string | null;
  razorpay_payment_id?: string | null;
  total: number;
  created_at: string;
  paid_at?: string | null;
  estimated_delivery: string | null;
  shipping_address: ShippingAddress | null;
  updated_at: string;
  waybill: string | null;
  items: OrderItemDetail[];
  timeline: TimelineEntry[];
}

export interface OrderListItem {
  id: string;
  invoice_number: string | null;
  status: OrderStatus;
  payment_status: string;
  total: number;
  created_at: string;
  estimated_delivery: string | null;
  item_count: number;
  first_item_image?: string | null;
  first_item_name?: string | null;
}
