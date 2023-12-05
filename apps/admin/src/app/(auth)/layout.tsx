import { memo, ReactNode } from 'react';
import { AxiomWebVitals } from 'next-axiom';
import { GeistSans } from 'geist/font/sans';

import ThemeProvider from '@mcsph/ui/containers/theme-provider';
import SWRProvider from '@/components/swr-provider';

import { cn, defaultUrl } from '@mcsph/utils';

import Nav from '@/components/nav/nav';
import '@mcsph/ui/globals.css';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Man Cave Supplies PH, Inc. | Staff Portal',
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

const SiteNav = memo(Nav);

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html
      lang="en"
      className={cn('antialiased', GeistSans.className)}
      suppressHydrationWarning
    >
      <AxiomWebVitals />

      <body>
        <SWRProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SiteNav />

            <main>{children}</main>
          </ThemeProvider>
        </SWRProvider>
      </body>
    </html>
  );
}
