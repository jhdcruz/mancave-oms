import { NextResponse } from 'next/server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { cookies } from 'next/headers';

import { adminServerClient } from '@mcsph/supabase/lib/admin.server';

export const PATCH = withAxiom(async (req: AxiomRequest) => {
  const body: Record<string, any> = await req.json();

  const cookieStore = cookies();
  const supabase = adminServerClient(cookieStore);

  const id = body.id;
  const avatar_url = body.avatar_url;
  const first_name = body.first_name;
  const last_name = body.last_name;
  const middle_name = body.middle_name;
  const email = body.email;
  const phone = body.phone;
  const role = body.role;
  const active = body.active;

  const { data: user, error } = await supabase.auth.admin.updateUserById(id, {
    email: email,
    email_confirm: true,
    user_metadata: {
      avatar_url: avatar_url,
      first_name: first_name,
      last_name: last_name,
      middle_name: middle_name,
      email: email,
      phone: phone,
      role: role,
      active: active,
    },
  });

  if (error) req.log.error('Error updating user to auth.users', { error });

  return NextResponse.json({ user, error });
});
