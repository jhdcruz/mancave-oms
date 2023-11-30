import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';

import { serverClient } from '../../lib/server';
import { DatabaseSession } from '../../types';

/**
 * This method is useful for checking if the user is authorized
 * because it validates the user's access token JWT on the server.
 *
 * Should be used only when you require the most current user data.
 * For faster results, `getSession().session.user` is recommended.
 */
export const getCurrentUser = async () => {
  const cookieStore = cookies();
  const supabase = serverClient(cookieStore);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
};

export const getCurrentSession = async () => {
  const cookieStore = cookies();
  const supabase = serverClient(cookieStore);

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return { session, error };
};

export const getCurrentUserRole = async (
  id: string,
  supabase?: SupabaseClient,
) => {
  if (!supabase) {
    const cookieStore = cookies();
    supabase = serverClient(cookieStore);
  }

  const { data, error } = await supabase
    .from('employees')
    .select('role')
    .eq('id', id)
    .single();

  return { data, error };
};

export const updateEmployee = async (
  id: string,
  data: Record<string, any>,
  { supabase }: DatabaseSession = {},
) => {
  if (!supabase) {
    const cookieStore = cookies();
    supabase = serverClient(cookieStore);
  }

  const { error } = await supabase
    .from('employees')
    .update({ data })
    .eq('id', id);

  return { error };
};
