import { SupabaseClient } from "@supabase/supabase-js";

export interface CreateOrderItemInput {
  variant_id: string;
  quantity: number;
  unit_price: number;
  line_total: number;
  product_name: string;
  product_image: string;
  product_sku: string;
  product_size: string;
  product_color?: string | null;
}

export interface CreateOrderPipelineInput {
  user_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  total: number;
  shipping_address: Record<string, unknown>;
  items: CreateOrderItemInput[];
}

export interface CreateOrderPipelineResult {
  order_id: string;
  invoice_number: string;
  payment_status: string;
  status: string;
  created_at: string;
  total: number;
  is_duplicate: boolean;
}

/**
 * Order Service: Invokes PostgreSQL create_order_pipeline_rpc function
 * to perform atomic transactional order creation and maps the result.
 */
export async function createOrderPipeline(
  supabase: SupabaseClient,
  input: CreateOrderPipelineInput
): Promise<CreateOrderPipelineResult> {
  if (!input.user_id) {
    throw new Error("User ID is required to create an order");
  }

  if (!input.items || input.items.length === 0) {
    throw new Error("Order items cannot be empty");
  }

  if (!input.razorpay_order_id || !input.razorpay_payment_id) {
    throw new Error("Razorpay order ID and payment ID are required");
  }

  const { data, error } = await supabase.rpc("create_order_pipeline_rpc", {
    p_user_id: input.user_id,
    p_razorpay_order_id: input.razorpay_order_id,
    p_razorpay_payment_id: input.razorpay_payment_id,
    p_total: input.total,
    p_shipping_address: input.shipping_address,
    p_items: input.items,
  });

  if (error) {
    console.error("[OrderService] create_order_pipeline_rpc failed:", error);
    throw new Error(error.message || "Failed to execute order creation pipeline");
  }

  const result = data as CreateOrderPipelineResult;

  if (!result || !result.order_id) {
    throw new Error("Order creation pipeline returned invalid result");
  }

  return result;
}
