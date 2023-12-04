import { serverClient } from '../../lib/server';
import { DatabaseSession, SupabaseClient } from '../../types';
import { processUserData, uploadAndGetAvatarImageUrl } from './utils/storage';

/**
 * This method is useful for checking if the user is authorized
 * because it validates the user's access token JWT on the server.
 *
 * Should be used only when you require the most current user data.
 * For faster results, `getSession().session.user` is recommended.
 */
export const getCurrentUser = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { user, error };
};

export const getCurrentSession = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  return { session, error };
};

export const getCurrentUserRole = async (
  id: string,
  supabase: SupabaseClient,
) => {
  const { data, error } = await supabase
    .from('employees')
    .select('role')
    .eq('id', id)
    .single();

  return { data, error };
};

export const getTotalEmployees = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  const { count, error } = await supabase
    .from('employees')
    .select('id', { count: 'exact' });

  return { count, error };
};

export const getEmployees = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  const { data, error } = await supabase
    .from('employees')
    .select(
      'id, first_name, last_name, middle_name, email, phone, role, avatar_url, active, created_at, last_updated',
    );

  return { data, error };
};

export const createEmployee = async (
  data: FormData,
  { supabase }: { supabase: SupabaseClient },
) => {
  const formData = await processUserData(data, { supabase: supabase });

  const { data: employee, error } = await supabase
    .from('employees')
    .insert(formData)

  // return the employee
  

  return { employee, error };
};

export const updateEmployee = async (
  id: string,
  data: FormData,
  { supabase }: { supabase: SupabaseClient },
) => {
  const formData = await processUserData(data, { supabase: supabase });

  const { data: employee, error } = await supabase
    .from('employees')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  return { employee, error };
};

export const deleteEmployee = async (
  id: string,
  { supabase }: { supabase: SupabaseClient },
) => {
  const { error } = await supabase.from('employees').delete().eq('id', id);

  return { error };
};

export const disableEmployee = async (
  id: string,
  { supabase }: { supabase: SupabaseClient },
) => {
  const { error } = await supabase
    .from('employees')
    .update({ disabled: true })
    .eq('id', id);

  return { error };
};
