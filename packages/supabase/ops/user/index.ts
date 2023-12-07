import { SupabaseClient } from '../../types';
import { processCustomerData, processUserData } from './utils/storage';

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
    .select()
    .order('created_at', { ascending: false });

  return { data, error };
};

export const createEmployee = async (
  data: FormData,
  { supabase }: { supabase: SupabaseClient },
) => {
  const formData = await processUserData(data, { supabase: supabase });

  const { data: employee, error } = await supabase
    .from('employees')
    .insert(formData);

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

export const getTotalCustomers = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  const { count, error } = await supabase
    .from('customers')
    .select('id', { count: 'exact' });

  return { count, error };
};

export const getCustomers = async ({
  supabase,
}: {
  supabase: SupabaseClient;
}) => {
  const { data, error } = await supabase
    .from('customers')
    .select()
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createCustomer = async (
  data: FormData,
  { supabase }: { supabase: SupabaseClient },
) => {
  const formData = await processCustomerData(data, { supabase: supabase });

  const { data: customer, error } = await supabase
    .from('customers')
    .insert(formData)
    .select()
    .single();

  return { customer, error };
};

export const updateCustomer = async (
  id: string,
  data: FormData,
  { supabase }: { supabase: SupabaseClient },
) => {
  const formData = await processCustomerData(data, { supabase: supabase });

  const { data: customer, error } = await supabase
    .from('customers')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  return { customer, error };
};

export const deleteCustomer = async (
  id: string,
  { supabase }: { supabase: SupabaseClient },
) => {
  const { error } = await supabase.from('customers').delete().eq('id', id);

  return { error };
};
