import { Logger } from 'next-axiom';

import { serverClient } from '../../lib/server';
import { DatabaseSession } from '../../types';
import { processProductData } from './utils/storage';

/*
 * We're providing a optional separate supabase client in the parameters
 * so that we can run functions using a single session only,
 * and prevent flooding the server with multiple requests.
 *
 * This also allows using browser client on the functions.
 */

/**
 * This returns the total product count
 * without the actual data
 */
export const getTotalProducts = async ({ supabase }: DatabaseSession = {}) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { count, error } = await supabase.from('products').select('id', {
    count: 'exact',
  });

  if (error) log.error('Error fetching total products', { error });

  return { count, error };
};

export const getProducts = async ({ supabase }: DatabaseSession = {}) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { data, error } = await supabase
    .from('products')
    .select()
    .order('created_at', { ascending: false });

  if (error) log.error('Error fetching products', { error });

  return { data, error };
};

export const getProductBySku = async (
  sku: string,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { data, error } = await supabase
    .from('products')
    .select('id, sku, name, type, price, qty')
    .eq('sku', sku)
    .eq('published', true)
    .single();

  if (error) log.error('Error fetching specific product', { error });

  return { data, error };
};

export const deleteProduct = async (
  id: number,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { error } = await supabase.from('products').delete().eq('id', id);

  if (error) log.error('Error deleting product to db', { error });

  return { error };
};

export const createProduct = async (
  product: FormData,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const formData = await processProductData(product, { supabase: supabase });

  // insert and return the id for image uploading
  const { error } = await supabase.from('products').insert(formData);

  if (error) log.error(`Error saving product: ${formData.sku}`, { error });

  return { error };
};

export const updateProduct = async (
  id: number,
  product: FormData,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const formData = await processProductData(product, { supabase: supabase });

  // update the products
  const { error } = await supabase
    .from('products')
    .update(formData)
    .eq('id', id);

  if (error) log.error(`Error updating product: ${id}`, { error });

  return { error };
};
