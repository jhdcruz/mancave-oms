import type { AuthFormProps } from '@mcsph/ui/containers/auth-form';

import { healthCheck } from '@mcsph/supabase';
import {
  googleSignIn,
  formSignIn,
  forgotAction,
} from '@mcsph/supabase/ops/auth';
import dynamic from 'next/dynamic';

const LoginScreen = dynamic(() => import('@mcsph/ui/containers/login-screen'), {
  ssr: false,
});

export default async function Index({
  searchParams,
}: {
  searchParams: { title: string; message: string };
}) {
  const authActions: AuthFormProps = {
    googleAction: googleSignIn,
    formAction: formSignIn,
    forgotAction: forgotAction,
  };

  const status = await healthCheck();

  return (
    <LoginScreen
      alert={searchParams}
      status={status}
      authActions={authActions}
    />
  );
}
