import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Browser client will not be initialized.");
    return {} as any; // Returning a safe empty object or null based on usage
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
