"use client";

import { useI18n } from "@/lib/i18n";

interface Props {
  variant?: "dark" | "light";
}

export default function LangToggle({ variant = "dark" }: Props) {
  const { lang, toggleLang } = useI18n();
  const border =
    variant === "light" ? "border-white/60 text-white" : "border-black/60 text-black";

  return (
    <button
      type="button"
      onClick={toggleLang}
      aria-label={`Cambia lingua (attuale: ${lang})`}
      className={`w-12 h-14 md:w-14 md:h-16 border-2 ${border} flex items-center justify-center hover:opacity-70 transition-opacity`}
    >
      <span className="text-base font-bold uppercase tracking-wider">
        {lang === "it" ? "EN" : "IT"}
      </span>
    </button>
  );
}
