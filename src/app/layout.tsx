import type { Metadata } from "next";
import { Special_Elite } from "next/font/google";
import { I18nProvider } from "@/lib/i18n";
import AppShell from "./AppShell";
import "./globals.css";

// Fallback display font: cross-platform Google font used until the bespoke
// "Dirty Headline" is dropped at /public/fonts/.
const specialElite = Special_Elite({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-special-elite",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Luca Guidotti",
  description: "Portfolio di Luca Guidotti — opere, esposizioni, contatti.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" className={specialElite.variable}>
      <body>
        <I18nProvider>
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}
