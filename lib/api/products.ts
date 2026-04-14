import { createClient } from "@/utils/supabase/client";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface ProductVariant {
  id: string;
  size: string;
  color: string | null;
  sku: string;
  stock_quantity: number;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  base_price: number;
  is_active: boolean;
  created_at: string;
  product_variants: ProductVariant[];
}

// ─── Image Mapping ──────────────────────────────────────────────────────────

/**
 * Maps a product slug to a local image path.
 * Falls back to a default image if the slug isn't recognized.
 */
const SLUG_IMAGE_MAP: Record<string, string> = {
  "arctic-dawn": "/images/shoes/bluewhite.jpg",
  "ochre-earth": "/images/shoes/yellow.jpg",
  "rust-ash": "/images/shoes/brownblack.jpg",
  "cd-heritage": "/images/shoes/whitefull.jpg",
  "navy-frost": "/images/shoes/darkblue.jpg",
};

export function getProductImage(slug: string): string {
  return SLUG_IMAGE_MAP[slug] || "/images/shoes/bluewhite.jpg";
}

// ─── Queries ────────────────────────────────────────────────────────────────

/**
 * Fetches all active products with their variants from Supabase.
 */
export async function getProducts(): Promise<SupabaseProduct[]> {
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

  if (error) throw error;

  return (data || []) as SupabaseProduct[];
}

/**
 * Fetch a single product by slug with all its variants.
 */
export async function getProductBySlug(
  slug: string
): Promise<SupabaseProduct | null> {
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
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }

  return data as SupabaseProduct;
}

/**
 * Fetch a single product by UUID with all its variants.
 */
export async function getProductById(
  id: string
): Promise<SupabaseProduct | null> {
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
    .eq("id", id)
    .eq("is_active", true)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null; // Not found
    throw error;
  }

  return data as SupabaseProduct;
}
