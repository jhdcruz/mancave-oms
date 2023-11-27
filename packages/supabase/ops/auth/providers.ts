import { browserClient } from '../../lib/client';

export const signInWithGoogle = async () => {
  const supabase = browserClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });

  if (error) return { error };
};
