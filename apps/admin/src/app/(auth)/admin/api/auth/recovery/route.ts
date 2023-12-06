import { NextResponse } from 'next/server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { cookies } from 'next/headers';

import { adminServerClient } from '@mcsph/supabase/lib/admin.server';
import { defaultUrl } from '@mcsph/utils';

export const POST = withAxiom(async (req: AxiomRequest) => {
  const body: Record<string, any> = await req.json();

  const cookieStore = cookies();
  const supabase = adminServerClient(cookieStore);

  switch (body.action) {
    case 'recovery':
      const { data: recoveryData, error: recoveryError } =
        await supabase.auth.resetPasswordForEmail(body.email, {
          redirectTo: `${defaultUrl}/auth/reset`,
        });
      return NextResponse.json({ recoveryData, recoveryError });

    case 'password':
      const { error: passwordError } = await supabase.auth.admin.updateUserById(
        body.id,
        {
          password: body.password,
        },
      );
      return NextResponse.json({ passwordError });
    default:
      break;
  }

  return NextResponse.json({});
});
