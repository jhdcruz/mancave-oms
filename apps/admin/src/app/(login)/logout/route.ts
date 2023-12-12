import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { type AxiomRequest, withAxiom } from 'next-axiom';

import { serverClient } from '@mcsph/supabase/lib/server';

export const GET = withAxiom(async (req: AxiomRequest) => {
  const requestUrl = new URL(req.url);

  const cookieStore = cookies();
  const supabase = serverClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  if (error) req.log.error('User had an error in signing out', { error });

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/login', requestUrl.origin));
});
