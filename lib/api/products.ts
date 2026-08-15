import { createClient } from "@/utils/supabase/client";
import { PRODUCT_CATALOG } from "@/lib/productCatalog";
import { Product } from "@/components/shop/ProductCard";

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

/**
 * Products for the shop grid / PDP: DB is authoritative for price and stock,
 * PRODUCT_CATALOG (keyed by slug) supplies display-only assets (images, colors).
 * Products without a matching catalog entry are skipped (no image to show).
 */
export async function getShopProducts(): Promise<Product[]> {
  const rows = await getProducts();

  return (rows || [])
    .map((row: any): Product | null => {
      const catalogEntry = PRODUCT_CATALOG[row.slug];
      if (!catalogEntry) return null;

      const variants = (row.product_variants || []).map((v: any) => ({
        variantId: v.id,
        size: String(v.size),
        stock: v.stock_quantity,
      }));

      return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        price: row.base_price,
        originalPrice: catalogEntry.originalPrice,
        image: catalogEntry.image,
        gallery: catalogEntry.gallery,
        category: catalogEntry.category,
        colors: catalogEntry.colors,
        sizes: variants.map((v: { size: string }) => v.size),
        variants,
        isAvailable: variants.some((v: { stock: number }) => v.stock > 0),
      };
    })
    .filter((p: Product | null): p is Product => p !== null);
}
