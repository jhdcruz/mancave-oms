import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for client-side with elevated permission
 *
 * Any method under the supabase.auth.admin namespace
 * requires a service_role key.
 *
 * These methods are considered admin methods and should
 * be called on a trusted server.
 *
 *  Never expose your `service_role` key in the browser.
 */
export const adminBrowserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!,
  );
