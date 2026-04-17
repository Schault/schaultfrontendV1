import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase URL or Anon Key is missing. Browser client will not be initialized.");
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: new Error('Missing Env') }),
        getSession: async () => ({ data: { session: null }, error: new Error('Missing Env') })
      }
    } as any;
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}
