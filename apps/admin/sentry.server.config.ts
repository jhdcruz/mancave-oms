import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 0.5,
  profilesSampleRate: 0.5,
  debug: false,
  integrations: [],
});
