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
  state: string;
  postal_code: string;
  phone?: string;
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
  variant_size: string;
  variant_color: string | null;
  variant_sku: string;
  product_slug: string;
}

export interface OrderDetail {
  id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  estimated_delivery: string | null;
  shipping_address: ShippingAddress | null;
  updated_at: string;
  items: OrderItemDetail[];
  timeline: TimelineEntry[];
}

export interface OrderListItem {
  id: string;
  status: OrderStatus;
  total: number;
  created_at: string;
  estimated_delivery: string | null;
  item_count: number;
}
