import { type NextRequest, NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/middleware";

export async function middleware(req: NextRequest) {
  const { supabase, response } = createClient(req);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (!session && !req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL("/login", req.nextUrl).href);
  }

  // TODO: Protected routes

  return response;
}
