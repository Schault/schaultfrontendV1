import { SupabaseClient } from "@supabase/supabase-js";
import { CreateOrderItemInput } from "./create-order-pipeline";

// Coupons: flat discount (INR) applied per unit quantity. Keep in sync with the
// checkout UI. ponytail: hardcoded map, move to a `coupons` table if marketing needs more.
export const COUPON_PER_UNIT_DISCOUNT: Record<string, number> = {
  "L20-MCMF": 500,
};

export interface RawCartItem {
  variant_id: string;
  quantity: number;
  product_image?: string | null;
}

export interface OrderPricing {
  items: CreateOrderItemInput[];
  subtotal: number;
  discount: number;
  total: number;
}

/**
 * Authoritative order pricing computed from the database. NEVER trusts client prices.
 * Prices come from products.base_price via the variant. The only client-supplied fields
 * used are quantity (stock-checked downstream in the RPC) and product_image (display only).
 */
export async function computeOrderPricing(
  supabase: SupabaseClient,
  rawItems: RawCartItem[],
  coupon?: string | null
): Promise<OrderPricing> {
  if (!Array.isArray(rawItems) || rawItems.length === 0) {
    throw new Error("Cart is empty");
  }

  const normalized = rawItems.map((it) => {
    const variant_id = String(it?.variant_id || "").trim();
    const quantity = Math.floor(Number(it?.quantity));
    if (!variant_id) throw new Error("Cart item is missing a product variant");
    if (!Number.isFinite(quantity) || quantity < 1) {
      throw new Error("Invalid item quantity");
    }
    return { variant_id, quantity, product_image: it.product_image ?? "" };
  });

  const variantIds = Array.from(new Set(normalized.map((i) => i.variant_id)));

  const { data: variants, error } = await supabase
    .from("product_variants")
    .select("id, size, color, sku, products ( name, base_price )")
    .in("id", variantIds);

  if (error) throw new Error(`Failed to load product prices: ${error.message}`);
  if (!variants || variants.length !== variantIds.length) {
    throw new Error("One or more cart items reference an unknown product variant");
  }

  const byId = new Map<string, any>(variants.map((v: any) => [v.id, v]));

  let subtotal = 0;
  const items: CreateOrderItemInput[] = normalized.map((it) => {
    const v = byId.get(it.variant_id);
    const product = Array.isArray(v.products) ? v.products[0] : v.products;
    const unit_price = Number(product?.base_price);
    if (!Number.isFinite(unit_price) || unit_price <= 0) {
      throw new Error(`Product price unavailable for variant ${it.variant_id}`);
    }
    const line_total = unit_price * it.quantity;
    subtotal += line_total;
    return {
      variant_id: it.variant_id,
      quantity: it.quantity,
      unit_price,
      line_total,
      product_name: product?.name || "SCHAULT Product",
      product_image: it.product_image || "",
      product_sku: v.sku || "",
      product_size: v.size != null ? String(v.size) : "",
      product_color: v.color ?? null,
    };
  });

  const perUnit = coupon ? COUPON_PER_UNIT_DISCOUNT[coupon] || 0 : 0;
  const totalQty = normalized.reduce((s, i) => s + i.quantity, 0);
  const discount = Math.min(perUnit * totalQty, subtotal);
  const total = subtotal - discount;

  // Invariant guard for the money path: fails loudly if the arithmetic above ever breaks.
  if (total < 0 || total > subtotal) {
    throw new Error("Pricing computation produced an invalid total");
  }

  return { items, subtotal, discount, total };
}
