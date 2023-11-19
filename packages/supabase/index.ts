import { cookies } from 'next/headers';
import { serverClient } from './lib/server';

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

export { browserClient } from './lib/client';
export { serverClient } from './lib/server';
export { middlewareClient } from './lib/middleware';

// re-export supabase types
export type * from '@supabase/supabase-js';
