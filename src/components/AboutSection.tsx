"use client";

import { useI18n } from "@/lib/i18n";
import PlaceholderImage from "./PlaceholderImage";
import SectionLayout from "./SectionLayout";

export default function AboutSection() {
  const { t } = useI18n();

  return (
    <SectionLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start max-w-5xl">
        <div className="space-y-6 md:space-y-8 text-base md:text-lg leading-relaxed max-w-xl">
          <p>{t("aboutStatement")}</p>
          <p>{t("aboutBio")}</p>
          <div className="flex flex-col gap-2 pt-4">
            <a
              href="#"
              className="underline underline-offset-4 hover:text-rosso transition-colors w-fit"
            >
              {t("aboutCv")}
            </a>
            <a
              href="#"
              className="underline underline-offset-4 hover:text-rosso transition-colors w-fit"
            >
              {t("aboutPortfolio")}
            </a>
          </div>
        </div>

        <div className="aspect-[3/4] w-full max-w-md">
          <PlaceholderImage label={t("placeholderPortrait")} />
        </div>
      </div>
    </SectionLayout>
  );
}
