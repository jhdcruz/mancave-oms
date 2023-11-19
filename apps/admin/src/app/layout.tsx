import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { AxiomWebVitals } from 'next-axiom';
import { GeistSans } from 'geist/font/sans';

import ThemeProvider from '@mcsph/ui/containers/theme-provider';

import { getCurrentSession } from '@mcsph/supabase/ops/user';
import { defaultUrl } from '@mcsph/utils';

import '@mcsph/ui/globals.css';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Man Cave Supplies PH, Inc. | Staff Portal',
};

const HeaderNav = dynamic(() => import('@/components/nav/header-nav'), {
  ssr: false,
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
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {/* only show nav when authenticated */}
          {session && <HeaderNav session={session} />}

          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
