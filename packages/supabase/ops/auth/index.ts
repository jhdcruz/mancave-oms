import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Logger } from 'next-axiom';
import { redirect } from 'next/navigation';

import { defaultUrl } from '@mcsph/utils';
import { serverClient } from '../../';
import { SupabaseClient } from '@supabase/supabase-js';

export const googleSignIn = async () => {
  'use server';
  const cookieStore = cookies();
  const log = new Logger();

  const supabase = serverClient(cookieStore);

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) {
    log.with(error).error('Google login failed attempt');
    await log.flush();

    return { error };
  }
};

export const formSignIn = async (formData: FormData, redirectTo?: string) => {
  'use server';
  const cookieStore = cookies();
  const log = new Logger();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const supabase = serverClient(cookieStore);

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    log.with(error).info('User login failed attempt', { email: email });
    await log.flush();

    return { error };
  }

  return redirect(redirectTo || '/');
};

export const forgotAction = async () => {
  'use server';
  const cookieStore = cookies();
  const log = new Logger();

  const supabase = serverClient(cookieStore);

  // TODO: Update password form and action
  //       https://supabase.com/docs/guides/auth/auth-password-reset#update-password
  const { error } = await supabase.auth.resetPasswordForEmail('', {
    redirectTo: `${defaultUrl}/auth?next=/reset-password`,
  });

  if (error) {
    log.with(error).error('Error reset password request', { email: 'TODO' });
    await log.flush();

    return { error };
  }
};
