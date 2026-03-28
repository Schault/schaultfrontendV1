import { createBrowserClient } from "@supabase/ssr";

/**
 * Creates a Supabase client for use in Client Components ("use client").
 *
 * Uses the public anon key — all queries are automatically scoped
 * by RLS policies on the database side.
 *
 * Usage:
 *   const supabase = createClient();
 *   const { data } = await supabase.from('products').select('*');
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
