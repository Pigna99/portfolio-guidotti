"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { opere } from "@/content";
import type { Opera } from "@/content";
import Lightbox, { type LightboxItem } from "./Lightbox";
import PlaceholderImage from "./PlaceholderImage";
import SectionLayout from "./SectionLayout";

const GRID_SIZES = "(min-width: 1280px) 25vw, (min-width: 768px) 33vw, 50vw";

export default function OpereSection() {
  const { t, lang } = useI18n();
  const [open, setOpen] = useState<Opera | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const years = Array.from(new Set(opere.map((o) => o.year))).sort(
    (a, b) => b - a
  );

  const localizedTitle = (o: Opera) =>
    lang === "en" && o.title_en ? o.title_en : o.title;

  const buildLightboxItems = (o: Opera): LightboxItem[] => {
    const items: LightboxItem[] = [];
    const title = localizedTitle(o);
    if (o.videoId) {
      items.push({
        type: "video",
        title,
        meta:
          (lang === "en" ? o.description_en : o.description) ?? o.description,
        videoId: o.videoId,
      });
    }
    o.images.forEach((img, i) => {
      items.push({
        type: "image",
        title: `${title} (${i + 1}/${o.images.length})`,
        meta: (lang === "en" ? img.caption_en : img.caption) ?? img.caption,
        src: img.src,
        srcset: img.srcset,
        alt: lang === "en" && img.alt_en ? img.alt_en : img.alt,
      });
    });
    return items;
  };

  return (
    <SectionLayout>
      {opere.length === 0 ? (
        <p className="text-base opacity-70">
          Nessuna opera caricata. Aggiungi cartelle in{" "}
          <code className="bg-black/10 px-1 py-0.5 rounded">content/opere/</code>{" "}
          e lancia <code className="bg-black/10 px-1 py-0.5 rounded">npm run content</code>.
        </p>
      ) : (
        <div className="space-y-10 md:space-y-14">
          {years.map((year) => {
            const items = opere.filter((o) => o.year === year);
            return (
              <section key={year}>
                <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">
                  {year}
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {items.map((o) => {
                    const isHovered = hovered === o.id;
                    const title = localizedTitle(o);
                    return (
                      <button
                        key={o.id}
                        type="button"
                        onClick={() => setOpen(o)}
                        onMouseEnter={() => setHovered(o.id)}
                        onMouseLeave={() => setHovered(null)}
                        className="relative aspect-[3/4] block group"
                      >
                        <PlaceholderImage
                          src={o.cover?.src}
                          srcset={o.cover?.srcset}
                          sizes={GRID_SIZES}
                          alt={title}
                          label={t("placeholderImage")}
                        />
                        <div
                          className={`absolute inset-0 bg-rosso-vivo flex items-center justify-center text-white text-center px-3 transition-opacity duration-300 ${
                            isHovered ? "opacity-100" : "opacity-0"
                          }`}
                        >
                          <span className="text-sm md:text-base font-bold">
                            {title}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>
      )}

      {open && (
        <Lightbox
          items={buildLightboxItems(open)}
          onClose={() => setOpen(null)}
        />
      )}
    </SectionLayout>
  );
}
