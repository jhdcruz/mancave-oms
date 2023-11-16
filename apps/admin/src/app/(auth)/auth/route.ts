import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { type AxiomRequest, withAxiom } from "next-axiom";

import { serverClient } from "@mcsph/supabase";

// Used for SSR auth flows
export const GET = withAxiom(async (req: AxiomRequest) => {
  // The `/auth/callback` route is required for the server-side auth flow implemented
  // by the Auth Helpers package. It exchanges an auth code for the user's session.
  // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-sign-in-with-code-exchange
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get("code");

  if (code) {
    const cookieStore = cookies();
    const supabase = serverClient(cookieStore);
    await supabase.auth.exchangeCodeForSession(code);
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(requestUrl.origin);
});
