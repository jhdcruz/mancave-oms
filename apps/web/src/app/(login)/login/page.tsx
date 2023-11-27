import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';
import { formSignIn, healthCheck } from '@mcsph/supabase/ops/auth';
import { redirect } from 'next/navigation';

const LoginScreen = dynamic(() => import('@mcsph/ui/containers/login-screen'), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen w-full flex-col items-center justify-center p-5">
      <Loader2 className="animate-spin" size={24} />
      <p className="my-3 text-sm text-muted-foreground">
        We're working on it...
      </p>
    </div>
  ),
});

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { title: string; message: string };
}) {
  const formLogin = async (formData: FormData) => {
    'use server';
    const { error } = await formSignIn(formData, '/');

    if (error)
      redirect(
        '?title=Invalid Credentials&message=Invalid email or password. Please try again.',
      );
  };

  const status = async () => await healthCheck();

  return (
    <LoginScreen alert={searchParams} formAction={formLogin} status={status} />
  );
}
