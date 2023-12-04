import { type CookieOptions, createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Logger } from 'next-axiom';

/**
 * Supabase client for server with elevated permission
 *
 * Any method under the supabase.auth.admin namespace
 * requires a service_role key.
 *
 * These methods are considered admin methods and should
 * be called on a trusted server.
 *
 *  Never expose your `service_role` key in the browser.
 */
export const adminServerClient = (cookieStore: ReturnType<typeof cookies>) => {
  const log = new Logger();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            log.error('Error setting supabase server client cookie', { error });
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
            log.error('Error supabase server client cookie', { error });
          }
        },
      },
    },
  );
};
