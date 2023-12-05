import { NextResponse } from 'next/server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { cookies } from 'next/headers';

import { adminServerClient } from '@mcsph/supabase/lib/admin.server';

export const POST = withAxiom(async (req: AxiomRequest) => {
  const body: Record<string, string> = await req.json();

  const cookieStore = cookies();
  const supabase = adminServerClient(cookieStore);

  const { data, error } = await supabase.auth.admin.deleteUser(body.id);

  return NextResponse.json({ data, error });
});
