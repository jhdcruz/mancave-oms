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
  const full_name = body.full_name;
  const email = body.email;
  const phone = body.phone;
  const active = body.active;
  const billing_address = body.billing_address;
  const shipping_address = body.shipping_address;

  const customerData = {
    avatar_url: avatar_url,
    full_name: full_name,
    email: email,
    phone: phone,
    billing_address: billing_address,
    shipping_address: shipping_address,
    active: active,
  };

  const { data: user, error } = await supabase.auth.admin.updateUserById(id, {
    email: email,
    email_confirm: true,
    user_metadata: customerData,
  });

  if (error) req.log.error('Error updating user to auth.users', { error });

  return NextResponse.json({ user, error });
});
