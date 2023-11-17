import { cookies } from 'next/headers';
import { SupabaseClient } from '@supabase/supabase-js';

import { serverClient } from '../../';

export const getCurrentUserRole = async (
  id: string | number,
  supabase?: SupabaseClient,
) => {
  if (!supabase) {
    const cookieStore = cookies();
    supabase = serverClient(cookieStore);
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('roles (type)')
    .eq('id', id)
    .single();

  return { data, error };
};
