import { cookies } from 'next/headers';

import { type AxiomRequest, withAxiom } from 'next-axiom';
import { serverClient } from '@mcsph/supabase/lib/server';
import { NextResponse } from 'next/server';

export const GET = withAxiom(async (req: AxiomRequest) => {
  const cookieStore = cookies();
  const supabase = serverClient(cookieStore);

  const { error } = await supabase.auth.signOut();

  req.log.error('User had an error in signing out', { error });

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL('/login', req.url));
});
