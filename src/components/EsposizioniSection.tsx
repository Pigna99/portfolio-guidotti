"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { esposizioni } from "@/content";
import type { Esposizione } from "@/content";
import { formatDateRange } from "@/lib/format-date";
import Lightbox, { type LightboxItem } from "./Lightbox";
import SectionLayout from "./SectionLayout";

export default function EsposizioniSection() {
  const { lang } = useI18n();
  const [open, setOpen] = useState<Esposizione | null>(null);

  const years = Array.from(new Set(esposizioni.map((e) => e.year))).sort(
    (a, b) => b - a
  );

  const localized = (e: Esposizione) => ({
    title: lang === "en" && e.title_en ? e.title_en : e.title,
    venue: lang === "en" && e.venue_en ? e.venue_en : e.venue,
    description:
      lang === "en" && e.description_en ? e.description_en : e.description,
  });

  const buildLightboxItems = (e: Esposizione): LightboxItem[] => {
    const { title, venue } = localized(e);
    return e.media.map((m, i): LightboxItem => {
      const baseTitle = `${title} (${i + 1}/${e.media.length})`;
      const meta =
        (lang === "en" ? m.caption_en : m.caption) ?? m.caption ?? venue;
      if (m.type === "video") {
        return { type: "video", title: baseTitle, meta, videoId: m.videoId };
      }
      return {
        type: "image",
        title: baseTitle,
        meta,
        src: m.src,
        srcset: m.srcset,
        alt: lang === "en" && m.alt_en ? m.alt_en : m.alt,
      };
    });
  };

  return (
    <SectionLayout>
      {esposizioni.length === 0 ? (
        <p className="text-base opacity-70">
          Nessuna esposizione caricata. Aggiungi cartelle in{" "}
          <code className="bg-black/10 px-1 py-0.5 rounded">
            content/esposizioni/
          </code>{" "}
          e lancia{" "}
          <code className="bg-black/10 px-1 py-0.5 rounded">
            npm run content
          </code>
          .
        </p>
      ) : (
        <div className="space-y-10 md:space-y-14">
          {years.map((year) => {
            const items = esposizioni.filter((e) => e.year === year);
            return (
              <section key={year}>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                  {year}
                </h2>
                <ul className="space-y-4 md:space-y-5">
                  {items.map((e) => {
                    const { title, venue, description } = localized(e);
                    const dateRange = formatDateRange(
                      e.start_date,
                      e.end_date,
                      lang
                    );
                    const hasMedia = e.media.length > 0;

                    const renderContent = (clickable: boolean) => {
                      const linkClass = clickable
                        ? "underline underline-offset-4 decoration-black/40 group-hover:decoration-rosso"
                        : "";
                      return (
                        <>
                          <p
                            className={`text-base md:text-lg font-bold ${linkClass}`}
                          >
                            {title}
                          </p>
                          {venue && (
                            <p
                              className={`text-sm md:text-base mt-1 ${linkClass}`}
                            >
                              {venue}
                            </p>
                          )}
                          {dateRange && (
                            <p className="text-xs md:text-sm opacity-70 mt-1">
                              {dateRange}
                            </p>
                          )}
                          {description && (
                            <p
                              className={`text-sm md:text-base mt-2 opacity-90 max-w-3xl ${linkClass}`}
                            >
                              {description}
                            </p>
                          )}
                        </>
                      );
                    };

                    return (
                      <li
                        key={e.id}
                        className="border-t border-black/30 pt-4"
                      >
                        {hasMedia ? (
                          <button
                            type="button"
                            onClick={() => setOpen(e)}
                            className="block text-left w-full group hover:text-rosso transition-colors cursor-pointer"
                          >
                            {renderContent(true)}
                          </button>
                        ) : (
                          <div>{renderContent(false)}</div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      )}

      {open && open.media.length > 0 && (
        <Lightbox
          items={buildLightboxItems(open)}
          onClose={() => setOpen(null)}
        />
      )}
    </SectionLayout>
  );
}
