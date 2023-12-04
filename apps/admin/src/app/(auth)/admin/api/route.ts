import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { type AxiomRequest, withAxiom } from 'next-axiom';

import { adminServerClient } from '@mcsph/supabase/lib/admin.server';
import { getEmployees, getTotalEmployees } from '@mcsph/supabase/ops/user';

export const GET = withAxiom(async (req: AxiomRequest) => {
  const requestUrl = new URL(req.url);

  // search params
  const count = requestUrl.searchParams.has('count');
  const query = requestUrl.searchParams.get('q');

  const cookieStore = cookies();
  const supabase = adminServerClient(cookieStore);

  if (count) {
    const { count } = await getTotalEmployees({ supabase: supabase });
    return NextResponse.json({ count });
  }

  if (query === 'employees') {
    const { data } = await getEmployees({ supabase: supabase });
    return NextResponse.json({ data });
  }

  return NextResponse.json({});
});
