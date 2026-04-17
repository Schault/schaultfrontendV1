import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Important: ensure session is refreshed
  const response = await updateSession(request);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const path = request.nextUrl.pathname;
  
  const isProtectedPath =
    path.startsWith("/cart") ||
    path.startsWith("/checkout") ||
    path.startsWith("/orders") ||
    path.startsWith("/profile");

  const isAuthPath = path.startsWith("/auth") && !path.startsWith("/auth/callback");

  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn("Supabase environment variables are missing. Middleware will act as log out.");
    if (isProtectedPath) {
      return NextResponse.redirect(new URL("/auth", request.url));
    }
    return response;
  }

  // Quick check for the user to make routing decisions
  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll() {
          // handled by updateSession
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();



  if (isProtectedPath && !user) {
    return NextResponse.redirect(new URL("/auth", request.url));
  }

  if (isAuthPath && user) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|assets|images|sequence|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
