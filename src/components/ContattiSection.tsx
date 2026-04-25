"use client";

import { useI18n } from "@/lib/i18n";
import PlaceholderImage from "./PlaceholderImage";
import SectionLayout from "./SectionLayout";

export default function ContattiSection() {
  const { t } = useI18n();

  return (
    <SectionLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-5xl">
        <dl className="space-y-5 md:space-y-6 text-base md:text-lg max-w-md">
          <div>
            <dt className="text-xs md:text-sm uppercase tracking-widest opacity-60">
              {t("contattiEmail")}
            </dt>
            <dd className="mt-1">
              <a
                href="mailto:hello@example.com"
                className="hover:text-rosso transition-colors"
              >
                hello@example.com
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-xs md:text-sm uppercase tracking-widest opacity-60">
              {t("contattiPhone")}
            </dt>
            <dd className="mt-1">+39 000 000 0000</dd>
          </div>
          <div>
            <dt className="text-xs md:text-sm uppercase tracking-widest opacity-60">
              {t("contattiAddress")}
            </dt>
            <dd className="mt-1">Via Esempio 1, 00100 Roma, IT</dd>
          </div>
          <div>
            <dt className="text-xs md:text-sm uppercase tracking-widest opacity-60">
              {t("contattiPiva")}
            </dt>
            <dd className="mt-1">IT 12345678901</dd>
          </div>
        </dl>

        <div className="aspect-square w-full max-w-md">
          <PlaceholderImage label={t("placeholderStudio")} />
        </div>
      </div>
    </SectionLayout>
  );
}
