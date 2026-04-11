import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";
import { createServerClient } from "@supabase/ssr";

export async function middleware(request: NextRequest) {
  // Important: ensure session is refreshed
  const response = await updateSession(request);

  // Quick check for the user to make routing decisions
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const path = request.nextUrl.pathname;
  
  const isProtectedPath =
    path.startsWith("/cart") ||
    path.startsWith("/checkout") ||
    path.startsWith("/orders") ||
    path.startsWith("/profile");

  const isAuthPath = path.startsWith("/auth") && !path.startsWith("/auth/callback");

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
