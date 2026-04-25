import type { Metadata } from "next";
import { I18nProvider } from "@/lib/i18n";
import AppShell from "./AppShell";
import "./globals.css";

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
    <html lang="it">
      <body>
        <I18nProvider>
          <AppShell>{children}</AppShell>
        </I18nProvider>
      </body>
    </html>
  );
}
