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

const DEFAULT_PRODUCT_DEFS = [
  { id: "bluebird", slug: "bluebird", name: "BlueBird", price: 2999, isAvailable: false },
  { id: "redeye", slug: "redeye", name: "RedEye", price: 2999, isAvailable: true },
  { id: "daydream", slug: "daydream", name: "DayDream", price: 2999, isAvailable: true },
  { id: "daybreak", slug: "daybreak", name: "DayBreak", price: 2999, isAvailable: true },
  { id: "wildroot", slug: "wildroot", name: "WildRoot", price: 2999, isAvailable: false },
  { id: "sundaze", slug: "sundaze", name: "SunDaze", price: 2999, isAvailable: true },
];

export function getFallbackProducts(): Product[] {
  return DEFAULT_PRODUCT_DEFS.map((def) => {
    const catalogEntry = PRODUCT_CATALOG[def.slug];
    const sizes = ["4", "5", "6", "7", "8", "9", "10", "11"];
    const isAvail = def.isAvailable !== false;

    const variants = sizes.map((size) => ({
      variantId: `${def.id}-${size}`,
      size,
      stock: isAvail && size === "8" ? 10 : 0,
    }));

    return {
      id: def.id,
      slug: def.slug,
      name: def.name,
      price: def.price,
      originalPrice: catalogEntry?.originalPrice || 3999,
      image: catalogEntry?.image || `/images/shoes/${def.name}/1.png`,
      gallery: catalogEntry?.gallery || [
        `/images/shoes/${def.name}/1.png`,
        `/images/shoes/${def.name}/2.png`,
        `/images/shoes/${def.name}/3.png`,
        `/images/shoes/${def.name}/4.png`,
      ],
      category: catalogEntry?.category || "Shoe",
      colors: catalogEntry?.colors || [{ name: "Standard", hex: "#000000" }],
      sizes,
      variants,
      isAvailable: isAvail && variants.some((v) => v.stock > 0),
    };
  });
}

/**
 * Products for the shop grid / PDP: DB is authoritative for price and stock,
 * PRODUCT_CATALOG (keyed by slug) supplies display-only assets (images, colors).
 * Falls back to static catalog if DB is empty or fails.
 */
export async function getShopProducts(): Promise<Product[]> {
  try {
    const rows = await getProducts();

    if (!rows || rows.length === 0) {
      return getFallbackProducts();
    }

    const mapped = rows
      .map((row: any): Product | null => {
        const rawSlug = row.slug || "";
        const normalizedSlug = rawSlug.toLowerCase().replace(/[-_ ]/g, "");

        const catalogEntry =
          PRODUCT_CATALOG[rawSlug] ||
          PRODUCT_CATALOG[normalizedSlug] ||
          Object.values(PRODUCT_CATALOG).find(
            (c) => c.slug.toLowerCase().replace(/[-_ ]/g, "") === normalizedSlug
          );

        if (!catalogEntry) return null;

        const variants = (row.product_variants || []).map((v: any) => ({
          variantId: v.id,
          size: String(v.size),
          stock: v.stock_quantity,
        }));

        const sizes = variants.length > 0
          ? variants.map((v: { size: string }) => v.size)
          : ["4", "5", "6", "7", "8", "9", "10", "11"];

        const isOut = normalizedSlug === "bluebird" || normalizedSlug === "wildroot";

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
          sizes,
          variants: isOut ? variants.map((v: any) => ({ ...v, stock: 0 })) : variants,
          isAvailable: !isOut && variants.some((v: { stock: number }) => v.stock > 0),
        };
      })
      .filter((p: Product | null): p is Product => p !== null);

    if (mapped.length === 0) {
      return getFallbackProducts();
    }

    return mapped;
  } catch (err) {
    console.error("Error fetching products from DB, using fallback catalog:", err);
    return getFallbackProducts();
  }
}
