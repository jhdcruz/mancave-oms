import { lazy, Suspense } from 'react';

import { AlertCircle, Boxes } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../components/alert';
import { Skeleton } from '../components/skeleton';

import type { AuthFormProps } from './auth-form';
import LabeledDivider from './labeled-divider';

// lazy-load client components
const ThemeSwitcher = lazy(() => import('./theme-switcher'));
const AuthForm = lazy(() => import('./auth-form'));
const SystemStatus = lazy(() => import('./system-status'));

export default function LoginScreen({
  alert,
  status,
  authActions,
}: {
  alert: { title: string; message: string };
  status: boolean;
  authActions: AuthFormProps;
}) {
  return (
    <div className="container relative inset-0 grid h-screen items-center justify-center lg:px-0">
      {/* Right-side panel */}
      <div className="p-4 lg:p-8">
        {/* Branding */}
        <div className="absolute left-10 top-11 z-20 flex items-center text-lg font-medium">
          <Boxes className="mr-2" size={26} />
          <span className="hidden md:block">Man Cave Supplies PH, Inc.</span>
        </div>

        <div className="absolute right-10 top-10 z-20 flex items-center">
          <Suspense
            fallback={<Skeleton className="h-[2.5rem] w-[2.5rem] rounded-lg" />}
          >
            <ThemeSwitcher outline />
          </Suspense>
        </div>

        <div className="border-1 mx-auto flex w-[390px] flex-col justify-center space-y-6 rounded-lg border p-12 shadow sm:w-[410px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Good to see you!
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials below to login.
            </p>
          </div>

          {/* Login alerts */}
          {alert?.message && (
            <Alert variant="destructive" className="text-left text-sm">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>{alert.title}</AlertTitle>
              <AlertDescription>{alert.message}</AlertDescription>
            </Alert>
          )}

          <Suspense
            fallback={
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <div className="mb-1 grid gap-1">
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                    <Skeleton className="h-10 rounded-lg" />
                  </div>
                </div>
                <LabeledDivider text="or continue with" />
                <Skeleton className="h-10 rounded-lg" />
              </div>
            }
          >
            <AuthForm {...authActions} />
          </Suspense>

          <div className="mt-1" />

          <Suspense
            fallback={<Skeleton className="h-[5rem] w-[2rem] rounded-lg" />}
          >
            <SystemStatus connected={status} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
