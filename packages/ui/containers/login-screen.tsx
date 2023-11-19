import { lazy, Suspense } from 'react';

import { AlertCircle, Boxes } from 'lucide-react';

import { Alert, AlertDescription, AlertTitle } from '../components/alert';
import { Skeleton } from '../components/skeleton';

import type { AuthFormProps } from './auth-form';
import Announcements from './announcements';
import SystemStatus from './system-status';
import LabeledDivider from './labeled-divider';

// lazy-load client components
const ThemeSwitcher = lazy(() => import('./theme-switcher'));
const AuthForm = lazy(() => import('./auth-form'));

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
    <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      {/* Left-side panel */}
      <div className="relative hidden h-screen flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />

        {/* Branding */}
        <div className="relative z-20 flex items-center text-lg font-medium">
          <Boxes className="mr-2" size={26} />
          Man Cave Supplies PH, Inc.
        </div>

        {/*
        TODO: Show public-facing/non-sensitive announcement
              Ex. System Updates, Maintenance, etc.
        */}
        <div className="relative z-20 mt-10">
          <Announcements />
        </div>
      </div>

      {/* Right-side panel */}
      <div className="lg:p-8">
        <div className="absolute right-10 top-10 z-20 flex items-center">
          <Suspense
            fallback={<Skeleton className="h-[2.5rem] w-[2.5rem] rounded-lg" />}
          >
            <ThemeSwitcher outline />
          </Suspense>
        </div>

        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <SystemStatus connected={status} />

            <h1 className="text-2xl font-semibold tracking-tight">
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
        </div>
      </div>
    </div>
  );
}
