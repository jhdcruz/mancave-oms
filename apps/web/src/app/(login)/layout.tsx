import { ReactNode } from 'react';
import { AxiomWebVitals } from 'next-axiom';
import { GeistSans } from 'geist/font/sans';

import ThemeProvider from '@mcsph/ui/containers/theme-provider';
import { defaultUrl } from '@mcsph/utils';

import '@mcsph/ui/globals.css';

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: 'Man Cave Supplies PH, Inc. | Staff Portal',
};

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <AxiomWebVitals />

      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main>{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
