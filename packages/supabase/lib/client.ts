import { createBrowserClient } from '@supabase/ssr';

/**
 * Supabase client for use in the browser.
 * or components that uses `"use client"`.
 */
export const browserClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
