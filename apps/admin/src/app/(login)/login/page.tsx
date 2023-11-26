import type { AuthFormProps } from '@mcsph/ui/containers/auth-form';
import dynamic from 'next/dynamic';
import { redirect } from 'next/navigation';

import {
  healthCheck,
  googleSignIn,
  formSignIn,
  forgotAction,
} from '@mcsph/supabase/ops/auth';

const LoginScreen = dynamic(() => import('@mcsph/ui/containers/login-screen'), {
  ssr: false,
});

export default function Login({
  searchParams,
}: {
  searchParams: { title: string; message: string };
}) {
  const formSubmit = async (formData: FormData) => {
    'use server';
    const { error } = await formSignIn(formData, '/');

    if (error) {
      redirect(
        '?title=Invalid credentials&message=Please check your email and password.',
      );
    }
  };

  const authActions: AuthFormProps = {
    googleAction: googleSignIn,
    formAction: formSubmit,
    forgotAction: forgotAction,
  };

  const status = healthCheck();

  return (
    <LoginScreen
      alert={searchParams}
      status={status}
      authActions={authActions}
    />
  );
}
