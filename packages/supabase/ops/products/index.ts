import { SupabaseClient } from '@supabase/supabase-js';
import { Logger } from 'next-axiom';

import { serverClient } from '../../lib/server';

/*
 * We're providing a optional separate supabase client in the parameters
 * so that we can run functions using a single session only,
 * and prevent flooding the server with multiple requests.
 *
 * This also allows using browser client on the functions.
 */

type DatabaseSession = {
  /** Supabase client to use */
  supabase?: SupabaseClient;
};

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

  const { count, error } = await supabase.from('products').select('*', {
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
    .select(
      'id, sku, image_url, name, description, type, qty, last_updated, disabled',
    );

  if (error) log.error('Error fetching products', { error });

  return { data, error };
};

export const getProduct = async (
  id: string,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { data, error } = await supabase
    .from('products')
    .select(
      'id, sku, image_url, name, description, type, qty, last_updated, last_updated_by, disabled',
    )
    .eq('id', id);

  if (error) log.error('Error fetching specific product', { error });

  return { data, error };
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

  const image = product.get('image') as File;
  const sku = product.get('sku') as string;

  const url = await uploadAndGetProductImageUrl(sku, image, {
    supabase: supabase,
  });

  // extract data from formdata
  const formData = {
    sku: sku,
    image_url: url,
    name: product.get('name') as string,
    description: product.get('description') as string,
    type: product.get('type') as string,
    qty: product.get('qty') as unknown as number,
    disabled: product.get('disabled') as string,
  };

  // insert and return the id for image uploading
  const { error } = await supabase.from('products').insert(formData);

  if (error) log.error('Error saving product to db', { error });

  return { error };
};

export const updateProduct = async (
  id: number | string,
  product: FormData,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const image = product.get('image') as File;
  const sku = product.get('sku') as string;
  const url = await uploadAndGetProductImageUrl(sku, image, {
    supabase: supabase,
  });

  // extract data from formdata
  const formData = {
    sku: sku,
    image_url: url,
    name: product.get('name') as string,
    description: product.get('description') as string,
    type: product.get('type') as string,
    qty: product.get('qty') as unknown as number,
    disabled: product.get('disabled') as string,
  };

  // update the products
  const { error } = await supabase
    .from('products')
    .update(formData)
    .eq('id', id);

  if (error) log.error(`Error updating product: ${id}`, { error });

  return { error };
};

/**
 * @param filename By default, we use SKUs as filenames
 */
export const uploadProductImage = async (
  filename: string | number,
  productImage: File,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  // get the file ext. of the image
  const ext = productImage.name.split('.').slice(0, -1).join('.');

  // upload image to supabase buckets using product id as filename
  const { data, error } = await supabase.storage
    .from('products')
    .upload(`${filename}.${ext}`, productImage, {
      cacheControl: '3600',
      upsert: true,
    });

  if (error)
    log.error(`Error uploading product image to buckets: ${filename}`, {
      error,
    });

  return { data };
};

export const getProductImageUrl = async (
  filepath: string,
  { supabase }: DatabaseSession = {},
) => {
  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  // get the public url of the uploaded image
  const { data } = supabase.storage.from('products').getPublicUrl(filepath);

  return data.publicUrl;
};

export const uploadAndGetProductImageUrl = async (
  filename: string | number,
  image: File,
  { supabase: supabase }: DatabaseSession = {},
) => {
  // upload the product image to supabase buckets `products`
  const { data } = await uploadProductImage(filename, image, {
    supabase: supabase,
  });

  // get the public url of the image uploaded
  const url = await getProductImageUrl(data!.path, { supabase: supabase });

  return url;
};
