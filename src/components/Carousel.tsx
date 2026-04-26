"use client";

import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";
import { carosello } from "@/content";

interface Props {
  intervalMs?: number;
}

interface FallbackSlide {
  label: string;
  hue: number;
}

const FALLBACK: FallbackSlide[] = [
  { label: "Esposizione 01", hue: 12 },
  { label: "Allestimento 02", hue: 28 },
  { label: "Studio 03", hue: 200 },
  { label: "Mostra 04", hue: 320 },
];

const SWIPE_THRESHOLD = 50;

export default function Carousel({ intervalMs = 5500 }: Props) {
  const { t, lang } = useI18n();
  const slides = carosello.length > 0 ? carosello : null;
  const total = slides ? slides.length : FALLBACK.length;

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [hovered, setHovered] = useState(false);
  const [loadedIndexes, setLoadedIndexes] = useState<Set<number>>(new Set());
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset auto-advance timer whenever `current` changes (manually OR via timer).
  useEffect(() => {
    if (!playing || total <= 1) return;
    const id = window.setInterval(() => {
      setCurrent((c) => (c + 1) % total);
    }, intervalMs);
    return () => window.clearInterval(id);
  }, [playing, total, intervalMs, current]);

  const next = () => setCurrent((c) => (c + 1) % total);
  const prev = () => setCurrent((c) => (c - 1 + total) % total);

  const markLoaded = (i: number) =>
    setLoadedIndexes((prev) => {
      if (prev.has(i)) return prev;
      const n = new Set(prev);
      n.add(i);
      return n;
    });

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    setDragging(true);
    setDragX(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    setDragX(e.touches[0].clientX - touchStartX.current);
  };

  const onTouchEnd = () => {
    if (touchStartX.current === null) return;
    const w = containerRef.current?.clientWidth ?? 1;
    if (dragX > SWIPE_THRESHOLD && total > 1) prev();
    else if (dragX < -SWIPE_THRESHOLD && total > 1) next();
    void w;
    touchStartX.current = null;
    setDragging(false);
    setDragX(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full min-h-[60vh] md:min-h-screen overflow-hidden bg-black/10 select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      onTouchCancel={onTouchEnd}
    >
      {slides
        ? slides.map((s, i) => {
            const offset = i - current;
            const altText =
              (lang === "en" ? s.alt_en : s.alt) ?? s.alt ?? "";
            const isLoaded = loadedIndexes.has(i);
            return (
              <div
                key={i}
                className={`absolute inset-0 ${
                  dragging
                    ? ""
                    : "transition-transform duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
                } bg-black/10`}
                style={{
                  transform: `translate3d(calc(${offset * 100}% + ${dragX}px), 0, 0)`,
                }}
              >
                {!isLoaded && (
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-black/15 via-black/5 to-black/20" />
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={(img) => {
                    if (img && img.complete && img.naturalWidth > 0) markLoaded(i);
                  }}
                  src={s.src}
                  srcSet={s.srcset}
                  sizes="(min-width: 768px) 60vw, 100vw"
                  alt={altText}
                  draggable={false}
                  onLoad={() => markLoaded(i)}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    isLoaded ? "opacity-100" : "opacity-0"
                  }`}
                />
              </div>
            );
          })
        : FALLBACK.map((s, i) => {
            const offset = i - current;
            return (
              <div
                key={i}
                className={`absolute inset-0 ${
                  dragging
                    ? ""
                    : "transition-transform duration-[800ms] ease-[cubic-bezier(0.65,0,0.35,1)]"
                } flex items-center justify-center`}
                style={{
                  transform: `translate3d(calc(${offset * 100}% + ${dragX}px), 0, 0)`,
                  backgroundColor: `hsl(${s.hue}, 35%, 72%)`,
                }}
              >
                <span className="text-black/50 text-sm md:text-base uppercase tracking-[0.2em] select-none">
                  [{s.label} — {t("placeholderImage")}]
                </span>
              </div>
            );
          })}

      {total > 1 && (
        <>
          <div
            className={`absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <button
              type="button"
              onClick={prev}
              aria-label={t("carouselPrev")}
              className="w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <ArrowLeft />
            </button>
            <button
              type="button"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? t("carouselPause") : t("carouselPlay")}
              className="w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              {playing ? <PauseIcon /> : <PlayIcon />}
            </button>
            <button
              type="button"
              onClick={next}
              aria-label={t("carouselNext")}
              className="w-11 h-11 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black transition-colors"
            >
              <ArrowRight />
            </button>
          </div>

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
            {Array.from({ length: total }).map((_, i) => (
              <span
                key={i}
                className={`block h-1 rounded-full transition-all ${
                  i === current ? "w-6 bg-black/70" : "w-1.5 bg-black/30"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function ArrowLeft() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M9 2 4 7l5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
      <path d="M2 1l9 6-9 6V1z" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="12" height="14" viewBox="0 0 12 14" fill="currentColor">
      <rect x="2" y="1" width="3" height="12" />
      <rect x="7" y="1" width="3" height="12" />
    </svg>
  );
}
