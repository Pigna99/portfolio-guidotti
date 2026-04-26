"use client";

import { useState } from "react"; // Aggiunto useState
import { useI18n } from "@/lib/i18n";
import PlaceholderImage from "./PlaceholderImage";
import SectionLayout from "./SectionLayout";

export default function ContattiSection() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const phoneNumber = "+39 331 2211150";

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset dopo 2 secondi
    } catch (err) {
      console.error("Errore nel copia:", err);
    }
  };

  return (
    <SectionLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
        <dl className="space-y-5 md:space-y-6 text-base md:text-lg max-w-md">
          {/* EMAIL */}
          <div>
            <dt className="text-xs md:text-sm uppercase tracking-widest opacity-60">
              {t("contattiEmail")}
            </dt>
            <dd className="mt-1">
              <a
                href="mailto:lucaguidotti1999@libero.it"
                className="hover:text-rosso transition-colors"
              >
                lucaguidotti1999@libero.it
              </a>
            </dd>
          </div>

          {/* TELEFONO (Copiabile) */}
          <div 
            className="group cursor-pointer w-fit" 
            onClick={handleCopy}
            title="Clicca per copiare"
          >
            <dt className="text-xs md:text-sm uppercase tracking-widest opacity-60 flex items-center gap-2">
              {t("contattiPhone")}
            </dt>
            <dd className="mt-1 transition-colors group-hover:text-rosso">
              {phoneNumber}
            </dd>
          </div>

          {/* INDIRIZZO */}
          <div>
            <dt className="text-xs md:text-sm uppercase tracking-widest opacity-60">
              {t("contattiAddress")}
            </dt>
            <dd className="mt-1">
              Via Luciano Zuccoli, 35, San Benedetto del Tronto (AP), 63074, IT
            </dd>
          </div>
        </dl>

        <div className="aspect-square w-full max-w-md">
          <PlaceholderImage src="/studio.webp" label={t("placeholderStudio")} />
        </div>
      </div>
    </SectionLayout>
  );
}