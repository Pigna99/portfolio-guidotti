"use client";

import { useI18n } from "@/lib/i18n";

interface Props {
  onEnter: () => void;
}

export default function IntroScreen({ onEnter }: Props) {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen w-full bg-rosso-vivo text-white flex flex-col p-6 md:p-10">
      <div className="flex-1 flex flex-col items-center justify-center gap-8">
        <button
          type="button"
          onClick={onEnter}
          aria-label="Entra nel sito"
          className="hover:opacity-80 transition-opacity"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/skull.png"
            alt=""
            draggable={false}
            className="w-36 md:w-56 max-w-full h-auto pointer-events-none"
          />
        </button>
        <p className="text-3xl md:text-5xl font-bold tracking-tight">Luca Guidotti</p>
      </div>

      <footer className="text-center text-xs md:text-sm space-y-1 pt-6">
        <p>© {year} Luca Guidotti</p>
        <p>
          {t("introDevelopedBy")}{" "}
          <a
            href="https://www.linkedin.com/in/andrea-pignotti-a87288208/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-4 hover:opacity-80 transition-opacity"
          >
            Andrea Pignotti
          </a>
        </p>
      </footer>
    </div>
  );
}
