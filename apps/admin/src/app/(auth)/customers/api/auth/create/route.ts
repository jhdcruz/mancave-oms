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
  const full_name = body.full_name;
  const billing_address = body.billing_address;
  const shipping_address = body.shipping_address;
  const email = body.email;
  const phone = body.phone;
  const active = body.active;

  const userData = {
    avatar_url: avatar_url,
    full_name: full_name,
    email: email,
    phone: phone,
    billing_address: billing_address,
    shipping_address: shipping_address,
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
    const { error: dbError } = await supabase.from('customers').insert({
      id: user.user.id,
      ...userData,
    });

    if (dbError) req.log.error('Error creating user to customers', { dbError });
  }

  return NextResponse.json({ user, error });
});
