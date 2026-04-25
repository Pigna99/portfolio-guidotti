"use client";

import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import Lightbox, { type LightboxItem } from "./Lightbox";
import PlaceholderImage from "./PlaceholderImage";
import SectionLayout from "./SectionLayout";

interface Opera {
  id: string;
  year: number;
  title: string;
  meta: string;
  cover?: string;
  images: { src?: string; meta?: string }[];
}

const OPERE: Opera[] = [
  {
    id: "o1",
    year: 2026,
    title: "Studio #01",
    meta: "Olio su tela",
    cover: "/opere/01-01.png",
    images: [
      { src: "/opere/01-01.png", meta: "Olio su tela, 50×40 cm — 2026" },
      { src: "/opere/01-01.png", meta: "Vista ravvicinata — 2026" },
      { src: "/opere/01-01.png", meta: "Dettaglio centrale — 2026" },
    ],
  },
  { id: "o2", year: 2026, title: "Untitled #02", meta: "Tecnica mista, 60×90 cm", images: [{}, {}, {}] },
  { id: "o3", year: 2026, title: "Untitled #03", meta: "Acrilico, 100×140 cm", images: [{}, {}, {}, {}] },
  { id: "o4", year: 2025, title: "Series A — I", meta: "Olio, 70×100 cm", images: [{}, {}, {}] },
  { id: "o5", year: 2025, title: "Series A — II", meta: "Olio, 70×100 cm", images: [{}, {}, {}] },
  { id: "o6", year: 2025, title: "Series A — III", meta: "Olio, 70×100 cm", images: [{}, {}, {}] },
  { id: "o7", year: 2025, title: "Studio piece", meta: "Carta e grafite, 30×40 cm", images: [{}, {}] },
];

export default function OpereSection() {
  const { t } = useI18n();
  const [open, setOpen] = useState<Opera | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const years = Array.from(new Set(OPERE.map((o) => o.year))).sort((a, b) => b - a);

  return (
    <SectionLayout>
      <div className="space-y-10 md:space-y-14">
        {years.map((year) => {
          const items = OPERE.filter((o) => o.year === year);
          return (
            <section key={year}>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{year}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {items.map((o) => {
                  const isHovered = hovered === o.id;
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
                        src={o.cover}
                        alt={o.title}
                        label={t("placeholderImage")}
                      />
                      <div
                        className={`absolute inset-0 bg-rosso-vivo flex items-center justify-center text-white text-center px-3 transition-opacity duration-300 ${
                          isHovered ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        <span className="text-sm md:text-base font-bold">{o.title}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {open && (
        <Lightbox
          items={open.images.map((img, i): LightboxItem => ({
            title: `${open.title} (${i + 1}/${open.images.length})`,
            meta: img.meta ?? `${open.meta} · ${open.year}`,
            src: img.src,
          }))}
          onClose={() => setOpen(null)}
        />
      )}
    </SectionLayout>
  );
}
