"use client";

import { useEffect, useState } from "react";
import { useI18n } from "@/lib/i18n";

export interface LightboxItem {
  title: string;
  meta?: string;
  src?: string;
  srcset?: string;
  alt?: string;
}

interface Props {
  items: LightboxItem[];
  startIndex?: number;
  onClose: () => void;
}

export default function Lightbox({ items, startIndex = 0, onClose }: Props) {
  const { t } = useI18n();
  const [index, setIndex] = useState(startIndex);
  const [showInfo, setShowInfo] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  const current = items[index];

  useEffect(() => {
    setImgLoaded(false);
  }, [current.src]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % items.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [items.length, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  const closeOnBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const imgSize =
    "max-w-[calc(100vw-5rem)] max-h-[calc(100dvh-7rem)] md:max-w-[calc(100vw-10rem)] md:max-h-[calc(100dvh-7rem)]";

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 animate-fade-in"
      role="dialog"
      aria-modal="true"
      onClick={closeOnBackdrop}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("lightboxClose")}
        className="absolute top-3 right-3 md:top-6 md:right-8 z-20 w-10 h-10 md:w-12 md:h-12 text-white hover:opacity-70 transition-opacity"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M5 5l18 18M23 5L5 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {items.length > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={t("carouselPrev")}
            className="absolute left-1 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 text-white hover:opacity-70 transition-opacity"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M18 4L8 14l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t("carouselNext")}
            className="absolute right-1 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 text-white hover:opacity-70 transition-opacity"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M10 4l10 10-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      <div
        className="absolute inset-0 flex items-center justify-center px-10 md:px-20 py-14 md:py-16"
        onClick={closeOnBackdrop}
      >
        <div
          className="relative inline-block"
          onMouseEnter={() => setShowInfo(true)}
          onMouseLeave={() => setShowInfo(false)}
        >
          {current.src ? (
            <>
              {!imgLoaded && (
                <div
                  className={`${imgSize} aspect-[4/5] bg-zinc-700/40 animate-pulse rounded-sm`}
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={current.src}
                srcSet={current.srcset}
                sizes="100vw"
                alt={current.alt ?? current.title}
                draggable={false}
                onLoad={() => setImgLoaded(true)}
                className={`block ${imgSize} w-auto h-auto select-none transition-opacity duration-300 ${
                  imgLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              />
            </>
          ) : (
            <div className="w-[72vw] max-w-md aspect-[3/4] bg-zinc-300/90 flex items-center justify-center px-4 text-zinc-700 text-sm uppercase tracking-widest text-center">
              {current.title}
            </div>
          )}

          {imgLoaded && (
            <>
              <div
                className={`absolute bottom-0 left-0 right-0 p-3 md:p-5 bg-gradient-to-t from-black/90 via-black/60 to-transparent text-white pointer-events-none transition-opacity duration-300 hidden md:block ${
                  showInfo ? "opacity-100" : "opacity-0"
                }`}
              >
                <h3 className="text-base md:text-lg font-bold">{current.title}</h3>
                {current.meta && (
                  <p className="text-xs md:text-sm opacity-80 mt-1">{current.meta}</p>
                )}
              </div>
              <div className="md:hidden absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent text-white pointer-events-none">
                <h3 className="text-sm font-bold">{current.title}</h3>
                {current.meta && (
                  <p className="text-xs opacity-80 mt-0.5">{current.meta}</p>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
