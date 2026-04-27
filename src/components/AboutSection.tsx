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
      <div className="text-base md:text-lg leading-relaxed">
        {/* Mobile: portrait first via order utility.
            Desktop: portrait floats right so the text wraps under it once it
            extends past the image's height. */}
        <div className="lg:float-right lg:ml-10 lg:mb-6 lg:w-[42%] lg:max-w-md mb-6">
          <div className="aspect-[3/4]">
            <PlaceholderImage
              src="/ritratto.webp"
              alt={t("aboutPortraitAlt") ?? ""}
              label={t("placeholderPortrait")}
            />
          </div>
        </div>

        <div className="space-y-12 md:space-y-16 max-w-3xl">
          <p className="whitespace-pre-line">{t("aboutStatement")}</p>
          <p className="whitespace-pre-line">{t("aboutBio")}</p>
          {(cvUrl || portfolioUrl) && (
            <div className="flex flex-col gap-2 pt-2">
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

        {/* Clear the float so the section ends cleanly */}
        <div className="lg:clear-both" />
      </div>
    </SectionLayout>
  );
}
