import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { AxiomWebVitals } from 'next-axiom';
import { GeistSans } from 'geist/font/sans';

import SWRProvider from '@/components/swr-provider';
import ThemeProvider from '@mcsph/ui/containers/theme-provider';

import { getCurrentSession } from '@mcsph/supabase/ops/user';
import { defaultUrl } from '@mcsph/utils';

import '@mcsph/ui/globals.css';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Man Cave Supplies PH, Inc. | Staff Portal',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

const HeaderNav = dynamic(() => import('@/components/nav/header-nav'), {
  ssr: false,
  loading: () => <header className="sticky top-0 z-50 h-16 w-full border-b" />,
});

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
