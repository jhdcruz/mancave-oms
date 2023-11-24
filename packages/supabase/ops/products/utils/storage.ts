import { Logger } from 'next-axiom';
import { serverClient } from '../../../lib/server';
import { DatabaseSession } from '../../../types';

/**
 * Process product from a FormData with an updated
 * FormData with public image_url of uploaded file.
 */
export const processProductData = async (
  product: FormData,
  { supabase }: DatabaseSession = {},
) => {
  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const image = product.get('image') as File;
  const sku = product.get('sku') as string;

  if (image) {
    const url = await uploadAndGetProductImageUrl(sku, image, {
      supabase: supabase,
    });

    // return FormData with updated image_url
    return {
      sku: sku,
      image_url: url,
      name: product.get('name') as string,
      description: product.get('description') as string,
      type: product.get('type') as string,
      qty: product.get('qty') as unknown as number,
      last_updated_by: product.get('last_updated_by') as string,
      published: product.get('published') as unknown as boolean,
    };
  } else {
    // return FormData with updated image_url
    return {
      sku: sku,
      name: product.get('name') as string,
      description: product.get('description') as string,
      type: product.get('type') as string,
      qty: product.get('qty') as unknown as number,
      last_updated_by: product.get('last_updated_by') as string,
      published: product.get('published') as unknown as boolean,
    };
  }
};

/**
 * Upload product image to products bucket.
 *
 * By default, we use SKUs as filenames
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
  const ext = productImage.name.split('.').pop();

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

/**
 * Get public url of an image in products bucket
 * */
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

/**
 * Upload the provided image file to products buckets
 * and return the public url.
 * */
export const uploadAndGetProductImageUrl = async (
  filename: string | number,
  image: File,
  { supabase: supabase }: DatabaseSession = {},
) => {
  try {
    // upload the product image to supabase buckets `products`
    const { data } = await uploadProductImage(filename, image, {
      supabase: supabase,
    });

    // get the public url of the image uploaded
    if (data) {
      return await getProductImageUrl(data.path, { supabase: supabase });
    }
  } catch (e: unknown) {
    throw new Error('Error uploading product image');
  }
};
