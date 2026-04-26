"use client";

import { useI18n } from "@/lib/i18n";
import { pdfs } from "@/content";
import PlaceholderImage from "./PlaceholderImage";
import SectionLayout from "./SectionLayout";

export default function AboutSection() {
  const { t, lang } = useI18n();
  const cvUrl = lang === "en" ? pdfs.cv_en : pdfs.cv_it;
  const portfolioUrl = lang === "en" ? pdfs.portfolio_en : pdfs.portfolio_it;

  return (
    <SectionLayout>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
        <div className="space-y-6 md:space-y-8 text-base md:text-lg leading-relaxed max-w-xl">
          <p className="whitespace-pre-line">{t("aboutStatement")}</p>
          <p className="whitespace-pre-line">{t("aboutBio")}</p>
          {(cvUrl || portfolioUrl) && (
            <div className="flex flex-col gap-2 pt-4">
              {cvUrl && (
                <a
                  href={cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-rosso transition-colors w-fit"
                >
                  {t("aboutCv")}
                </a>
              )}
              {portfolioUrl && (
                <a
                  href={portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-4 hover:text-rosso transition-colors w-fit"
                >
                  {t("aboutPortfolio")}
                </a>
              )}
            </div>
          )}
        </div>

        <div className="aspect-[3/4] w-full max-w-md">
          <PlaceholderImage src="/ritratto.webp" label={t("placeholderPortrait")} />
        </div>
      </div>
    </SectionLayout>
  );
}
