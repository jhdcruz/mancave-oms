'use client';
import { browserClient } from '@mcsph/supabase/lib/client';

const supabase = browserClient();

export interface Product {
  id: number;
  name: string;
  type: string;
  description: string;
  price: number;
  qty: number;
  image_url: string;
}

export async function fetchProductById(id: string): Promise<Product | null> {
  const { data } = await supabase
    .from('products')
    .select()
    .eq('id', id)
    .limit(1)
    .single();

  return data as Product | null;
}

export async function fetchProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select();

  if (error) {
    console.error('Error fetching data from Supabase:', error.message);
    return [];
  }

  return data as Product[];
}
