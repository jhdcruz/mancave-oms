import { NextResponse } from 'next/server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { cookies } from 'next/headers';

import { adminServerClient } from '@mcsph/supabase/lib/admin.server';

export const POST = withAxiom(async (req: AxiomRequest) => {
  const body: Record<string, any> = req.json();

  const cookieStore = cookies();
  const supabase = adminServerClient(cookieStore);

  switch (body.action) {
    case 'recovery':
      const { error: recoveryError } = await supabase.auth.admin.generateLink({
        type: 'recovery',
        email: body.email,
      });
      return NextResponse.json({ recoveryError });

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
