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
    const title = localizedTitle(o);
    return o.media.map((m, i): LightboxItem => {
      const baseTitle = `${title} (${i + 1}/${o.media.length})`;
      const meta =
        (lang === "en" ? m.caption_en : m.caption) ?? m.caption ?? undefined;
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

  // Touch-drag finger hover: as the user drags across the grid, highlight
  // whichever opera card is currently under the finger.
  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (!touch) return;
    const el = document.elementFromPoint(touch.clientX, touch.clientY);
    const card = el?.closest<HTMLElement>("[data-opera-id]");
    setHovered(card?.dataset.operaId ?? null);
  };

  const handleTouchEnd = () => {
    // Keep hovered until next click. Reset slightly later so the tap that
    // triggers the click does not clear the highlight prematurely.
    setTimeout(() => setHovered(null), 200);
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
        <div
          className="space-y-10 md:space-y-14"
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
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
                        data-opera-id={o.id}
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
                          className={`absolute inset-0 bg-rosso-vivo flex items-center justify-center text-white text-center px-3 transition-opacity duration-300 pointer-events-none ${
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

      {open && open.media.length > 0 && (
        <Lightbox
          items={buildLightboxItems(open)}
          onClose={() => setOpen(null)}
        />
      )}
    </SectionLayout>
  );
}
