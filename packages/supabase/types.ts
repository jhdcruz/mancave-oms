import { SupabaseClient } from '@supabase/supabase-js';

export type DatabaseSession = {
  /** Supabase client to use */
  supabase?: SupabaseClient;
};

export type * from '@supabase/supabase-js';
