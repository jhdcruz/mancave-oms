import { ReactNode } from "react";
import { AxiomWebVitals } from "next-axiom";
import { GeistSans } from "geist/font/sans";

import ThemeProvider from "@/components/theme-provider";
import { defaultUrl } from "@/utils";

import "./globals.css";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Inventory Management System",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className} suppressHydrationWarning>
      <AxiomWebVitals />

      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
