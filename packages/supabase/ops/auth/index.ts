import { redirect } from 'next/navigation';
import { Logger } from 'next-axiom';

import { defaultUrl } from '@mcsph/utils';

import { serverClient } from '../../lib/server';
import { cookies } from 'next/headers';

export const formSignIn = async (formData: FormData, redirectTo?: string) => {
  const log = new Logger();

  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const cookieStore = cookies();
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

  redirect(redirectTo || defaultUrl);
};

export const forgotAction = async (formData: FormData) => {
  const log = new Logger();

  const cookieStore = cookies();
  const supabase = serverClient(cookieStore);

  const email = formData.get('email') as string;

  // TODO: Update password form and action
  //       https://supabase.com/docs/guides/auth/auth-password-reset#update-password
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${defaultUrl}/auth?next=/reset-password`,
  });

  if (error) {
    log.with(error).error('Error reset password request', { email: 'TODO' });
    await log.flush();

    return { error };
  }
};

/**
 * Check if we can establish connection with the database.
 */
export const healthCheck = async () => {
  try {
    const cookieStore = cookies();
    serverClient(cookieStore);

    return true;
  } catch (e) {
    return false;
  }
};
