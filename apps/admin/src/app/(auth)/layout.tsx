import { memo, ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { AxiomWebVitals } from 'next-axiom';
import { GeistSans } from 'geist/font/sans';

import SWRProvider from '@/components/swr-provider';
import ThemeProvider from '@mcsph/ui/containers/theme-provider';

import { getCurrentSession } from '@mcsph/supabase/ops/user';
import { defaultUrl } from '@mcsph/utils';

import '@mcsph/ui/globals.css';
import { Session } from '@sentry/nextjs';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Man Cave Supplies PH, Inc. | Staff Portal',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  icon: [
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '32x32',
      href: '/favicon-32x32.png',
    },
    {
      rel: 'icon',
      type: 'image/png',
      sizes: '16x16',
      href: '/favicon-16x16.png',
    },
  ],
  appleTouchIcon: [
    {
      rel: 'apple-touch-icon',
      sizes: '180x180',
      href: '/apple-touch-icon.png',
    },
  ],
};

const LazyLoadNav = dynamic(() => import('@/components/nav/header-nav'), {
  ssr: false,
  loading: () => <header className="sticky top-0 z-50 h-16 w-full border-b" />,
});

const HeaderNav = memo(LazyLoadNav);

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { session } = await getCurrentSession();

  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <AxiomWebVitals />

      <body>
        <SWRProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <HeaderNav session={session} />

            <main>{children}</main>
          </ThemeProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
