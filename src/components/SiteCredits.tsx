"use client";

import { useI18n } from "@/lib/i18n";

export default function SiteCredits() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <p className="text-sm md:text-xs text-black/80 leading-relaxed">
      © {year} Luca Guidotti — {t("introDevelopedBy")}{" "}
      <a
        href="https://www.linkedin.com/in/andrea-pignotti-a87288208/"
        target="_blank"
        rel="noopener noreferrer"
        className="underline underline-offset-2 hover:text-rosso transition-colors"
      >
        Andrea Pignotti
      </a>
    </p>
  );
}
