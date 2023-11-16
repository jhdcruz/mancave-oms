import { NextResponse } from "next/server";

import { middlewareClient } from "@mcsph/supabase";
import { AxiomRequest, withAxiom } from "next-axiom";

const PUBLIC_FILE = /\.(.*)$/;

export const middleware = withAxiom(async (req: AxiomRequest) => {
  const { pathname } = req.nextUrl;
  const { supabase, response } = middlewareClient(req);

  // requires auth for every route
  await requireAuth(supabase, req);

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

  return response;
});
