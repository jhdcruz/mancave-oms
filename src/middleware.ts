import { NextResponse } from "next/server";

import { createClient } from "@/utils/supabase/middleware";
import { AxiomRequest, withAxiom } from "next-axiom";

const PUBLIC_FILE = /\.(.*)$/;

export const middleware = withAxiom(async (req: AxiomRequest) => {
  const { pathname } = req.nextUrl;
  const { supabase, response } = createClient(req);

  // fixes hydration errors when using redirect in middleware
  // https://github.com/vercel/next.js/discussions/38587
  if (
    pathname.startsWith("/_next") || // exclude Next.js internals
    pathname.startsWith("/api") || //  exclude all API routes
    pathname.startsWith("/static") || // exclude static files
    PUBLIC_FILE.test(pathname) // exclude all files in the public folder
  ) {
    return NextResponse.next();
  }

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) req.log.debug("Error acquiring user session", { error });

  if (!session && !req.nextUrl.pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // TODO: Protected routes

  return response;
});
