import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.5,
  debug: false,
  replaysOnErrorSampleRate: 0.5,
  replaysSessionSampleRate: 0.1,
  integrations: [
    new Sentry.BrowserTracing(),
  ],
});
