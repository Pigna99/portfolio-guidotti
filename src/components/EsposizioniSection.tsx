"use client";

import SectionLayout from "./SectionLayout";

interface Esposizione {
  year: number;
  title: string;
  venue: string;
  date: string;
}

const ESPOSIZIONI: Esposizione[] = [
  { year: 2026, title: "[Titolo mostra placeholder]", venue: "Galleria Esempio, Milano", date: "Gen — Mar 2026" },
  { year: 2026, title: "[Collettiva placeholder]", venue: "Spazio X, Roma", date: "Apr 2026" },
  { year: 2025, title: "[Personale placeholder]", venue: "Museo Esempio, Bologna", date: "Set — Nov 2025" },
  { year: 2025, title: "[Group show placeholder]", venue: "Foundation Y, Torino", date: "Mag 2025" },
  { year: 2025, title: "[Open studio placeholder]", venue: "Studio Guidotti, Firenze", date: "Mar 2025" },
];

export default function EsposizioniSection() {
  const years = Array.from(new Set(ESPOSIZIONI.map((e) => e.year))).sort((a, b) => b - a);

  return (
    <SectionLayout>
      <div className="space-y-10 md:space-y-14 max-w-3xl">
        {years.map((year) => {
          const items = ESPOSIZIONI.filter((e) => e.year === year);
          return (
            <section key={year}>
              <h2 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">{year}</h2>
              <ul className="space-y-4 md:space-y-5">
                {items.map((e, i) => (
                  <li key={i} className="border-t border-black/30 pt-4">
                    <p className="text-base md:text-lg font-bold">{e.title}</p>
                    <p className="text-sm md:text-base mt-1">{e.venue}</p>
                    <p className="text-xs md:text-sm opacity-70 mt-1">{e.date}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </SectionLayout>
  );
}
