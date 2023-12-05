import { NextResponse } from 'next/server';
import { withAxiom, AxiomRequest } from 'next-axiom';
import { cookies } from 'next/headers';

import { adminServerClient } from '@mcsph/supabase/lib/admin.server';

export const POST = withAxiom(async (req: AxiomRequest) => {
  const body: Record<string, any> = await req.json();

  const cookieStore = cookies();
  const supabase = adminServerClient(cookieStore);

  const password = body.password;
  const avatar_url = body.avatar_url;
  const first_name = body.first_name;
  const last_name = body.last_name;
  const middle_name = body.middle_name;
  const email = body.email;
  const phone = body.phone;
  const role = body.role;
  const active = body.active;

  const userData = {
    avatar_url: avatar_url,
    first_name: first_name,
    last_name: last_name,
    middle_name: middle_name,
    email: email,
    phone: phone,
    role: role,
    active: active,
  };

  const { data: user, error } = await supabase.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: userData,
  });

  if (error) {
    req.log.error('Error creating user to auth.users', { error });
  } else {
    const { error: dbError } = await supabase.from('employees').insert({
      id: user.user.id,
      ...userData,
    });

    if (dbError) req.log.error('Error creating user to employees', { dbError });
  }

  return NextResponse.json({ user, error });
});
