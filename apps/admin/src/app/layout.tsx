import { type ReactNode } from "react";
import { AxiomWebVitals } from "next-axiom";
import { Provider, ErrorBoundary } from "@rollbar/react";
import { GeistSans } from "geist/font/sans";

import { ThemeProvider } from "@mcsph/ui/containers/theme-provider";
import { defaultUrl } from "@mcsph/utils";

import "@mcsph/ui/globals.css";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Inventory Management System",
};

const rollbarConfig = {
  accessToken: process.env.ROLLBAR_TOKEN,
  environment: process.env.VERCEL_ENV,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <AxiomWebVitals />

      <body>
        <Provider config={rollbarConfig}>
          <ErrorBoundary>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              <main className="min-h-screen">{children}</main>
            </ThemeProvider>
          </ErrorBoundary>
        </Provider>
      </body>
    </html>
  );
}
