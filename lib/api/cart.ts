import { createClient } from "@/utils/supabase/client";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface SupabaseCartItem {
  id: string;            // cart_items.id
  variant_id: string;
  quantity: number;
  product_name: string;
  product_slug: string;
  base_price: number;
  variant_size: string;
  variant_color: string | null;
  variant_sku: string;
  stock_quantity: number;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

/**
 * Fetch the authenticated user's cart with full product/variant details.
 */
export async function getCart(): Promise<SupabaseCartItem[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("cart_items")
    .select(
      `
      id,
      quantity,
      variant_id,
      product_variants (
        id,
        sku,
        size,
        color,
        stock_quantity,
        products (
          id,
          name,
          slug,
          base_price
        )
      )
    `
    )
    .eq("user_id", user.id);

  if (error) throw error;

  return (data || []).map((item: any) => ({
    id: item.id,
    variant_id: item.variant_id,
    quantity: item.quantity,
    product_name: item.product_variants?.products?.name || "Unknown Product",
    product_slug: item.product_variants?.products?.slug || "",
    base_price: item.product_variants?.products?.base_price || 0,
    variant_size: item.product_variants?.size || "",
    variant_color: item.product_variants?.color || null,
    variant_sku: item.product_variants?.sku || "",
    stock_quantity: item.product_variants?.stock_quantity || 0,
  }));
}

/**
 * Add or update a cart item. Uses upsert on (user_id, variant_id).
 */
export async function addToCart(
  variantId: string,
  quantity: number
): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase.from("cart_items").upsert(
    {
      user_id: user.id,
      variant_id: variantId,
      quantity,
    },
    { onConflict: "user_id,variant_id" }
  );

  if (error) throw error;
}

/**
 * Remove a single cart item by its cart_items.id.
 */
export async function removeFromCart(cartItemId: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", cartItemId);

  if (error) throw error;
}

/**
 * Update quantity of an existing cart item.
 * If quantity <= 0, removes the item instead.
 */
export async function updateCartQuantity(
  cartItemId: string,
  quantity: number
): Promise<void> {
  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", cartItemId);

  if (error) throw error;
}

/**
 * Clear the entire cart for the current user.
 */
export async function clearCart(): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not authenticated");

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("user_id", user.id);

  if (error) throw error;
}
