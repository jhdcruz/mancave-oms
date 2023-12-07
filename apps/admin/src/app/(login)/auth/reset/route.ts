import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { type AxiomRequest, withAxiom } from 'next-axiom';

import { serverClient } from '@mcsph/supabase/lib/server';

export const GET = withAxiom(async (req: AxiomRequest) => {
  const requestUrl = new URL(req.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = serverClient(cookieStore);

    await supabase.auth.exchangeCodeForSession(code);
  }

  const resetPage = requestUrl.origin + '/auth/reset/password';

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(resetPage);
});
