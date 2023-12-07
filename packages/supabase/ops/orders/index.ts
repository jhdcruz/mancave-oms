import { Logger } from 'next-axiom';
import type { DatabaseSession } from '../../types';
import { serverClient } from '../../lib/server';

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
export const getTotalOrders = async ({ supabase }: DatabaseSession = {}) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { count, error } = await supabase.from('orders').select('id', {
    count: 'exact',
  });

  if (error) log.error('Error fetching total orders', { error });

  return { count, error };
};

export const getOrders = async ({ supabase }: DatabaseSession = {}) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { data, error } = await supabase
    .from('orders')
    .select(
      `
      id, 
      total_price, 
      payment,
      payment_status,
      order_status, 
      created_at, 
      last_updated,
      customers (
        full_name, 
        email,
        phone,
        shipping_address,
        billing_address
      )
    `,
    )
    .order('created_at', { ascending: false });

  if (error) log.error('Error fetching orders', { error });

  return { data, error };
};

export const deleteOrder = async (
  order_id: string,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { error } = await supabase.from('orders').delete().eq('id', order_id);

  if (error) log.error('Error deleting order', { error });

  return { error };
};

export const updateOrder = async (
  order_id: string,
  body: Record<string, any>,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { data, error } = await supabase
    .from('orders')
    .update(body)
    .eq('id', order_id);

  if (error) log.error('Error updating order', { error });

  return { data, error };
};

/* Order Details (items_order) */
export const getOrderDetails = async (
  order_id: string,
  { supabase }: DatabaseSession = {},
) => {
  const log = new Logger();

  if (!supabase) {
    const cookieStore = (await import('next/headers')).cookies();
    supabase = serverClient(cookieStore);
  }

  const { data, error } = await supabase
    .from('order_items')
    .select(
      `
      id,
      qty,
      product:product_id (
        id,
        sku,
        name,
        type,
        price
      )
    `,
    )
    .eq('order_id', order_id);

  if (error) log.error('Error fetching order details', { error });

  return { data, error };
};
