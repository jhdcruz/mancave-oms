import { NextResponse } from "next/server";
import { type AxiomRequest } from "next-axiom";

import { createClient } from "@/utils/supabase/middleware";

export async function middleware(req: AxiomRequest) {
  const { supabase, response } = createClient(req);

  // Refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error) req.log.error("Error getting session", { error });

  if (!session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl).href, {
      status: 401,
    });
  }

  // TODO: Protected routes

  return response;
}
