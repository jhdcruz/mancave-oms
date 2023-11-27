import { defaultUrl } from '@mcsph/utils';
import { browserClient } from '../../lib/client';

export const signInWithGoogle = async () => {
  const supabase = browserClient();

  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${defaultUrl}/auth`,
    },
  });

  if (error) return { error };
};
