import { createClient } from "@/utils/supabaseClient";

/**
 * Fetches all active products with their variants.
 *
 * Example return shape:
 * [
 *   {
 *     id: "550e...",
 *     name: "Schault Upper - Canvas",
 *     base_price: 899,
 *     product_variants: [
 *       { id: "...", size: "UK-8", color: "Midnight Black", stock_quantity: 50 }
 *     ]
 *   }
 * ]
 */
export async function getProducts() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("products")
    .select(
      `
      id,
      name,
      slug,
      description,
      base_price,
      is_active,
      created_at,
      product_variants (
        id,
        size,
        color,
        sku,
        stock_quantity
      )
    `
    )
    .eq("is_active", true)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data;
}
