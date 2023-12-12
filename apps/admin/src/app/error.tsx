'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    // Log the error to Sentry
    Sentry.captureException(error);
  }, [error]);

  return (
    <main className="container mx-auto flex w-[700p] items-center justify-center">
      <h2>Something went wrong!</h2>
    </main>
  );
}
