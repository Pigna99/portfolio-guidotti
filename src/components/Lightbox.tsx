"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

interface LightboxImage {
  type: "image";
  title: string;
  meta?: string;
  src?: string;
  srcset?: string;
  alt?: string;
}

interface LightboxVideo {
  type: "video";
  title: string;
  meta?: string;
  videoId: string;
}

export type LightboxItem = LightboxImage | LightboxVideo;

interface Props {
  items: LightboxItem[];
  startIndex?: number;
  onClose: () => void;
}

const SWIPE_THRESHOLD = 60;

export default function Lightbox({ items, startIndex = 0, onClose }: Props) {
  const { t } = useI18n();
  const [index, setIndex] = useState(startIndex);
  // Mobile tap toggles this. Desktop hover overrides it via local state.
  const [showInfo, setShowInfo] = useState(false);
  const [hoveringImage, setHoveringImage] = useState(false);
  const [imgLoaded, setImgLoaded] = useState<Record<number, boolean>>({});
  const [dragX, setDragX] = useState(0);
  const [dragging, setDragging] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);
  const moveAxis = useRef<"none" | "x" | "y">("none");

  const current = items[index];
  const total = items.length;

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(
    () => setIndex((i) => (i - 1 + total) % total),
    [total]
  );

  // Reset toggleable info every time we navigate to a different slide.
  useEffect(() => {
    setShowInfo(false);
  }, [index]);

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, onClose]);

  // Lock body + html scroll while open (iOS Safari needs html too).
  useEffect(() => {
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, []);

  // Preload neighbouring images
  useEffect(() => {
    const tryPreload = (i: number) => {
      const it = items[i];
      if (it && it.type === "image" && it.src) {
        const img = new Image();
        if (it.srcset) img.srcset = it.srcset;
        img.src = it.src;
      }
    };
    tryPreload((index + 1) % total);
    tryPreload((index - 1 + total) % total);
  }, [index, items, total]);

  const closeOnBackdrop = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  const resetTouch = () => {
    touchStartX.current = null;
    touchStartY.current = null;
    moveAxis.current = "none";
    setDragging(false);
    setDragX(0);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    // Multi-touch (pinch-to-zoom) → let the browser handle it
    if (e.touches.length > 1) {
      resetTouch();
      return;
    }
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    moveAxis.current = "none";
    setDragging(true);
    setDragX(0);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 1 || touchStartX.current === null || touchStartY.current === null) {
      return;
    }
    const dx = e.touches[0].clientX - touchStartX.current;
    const dy = e.touches[0].clientY - touchStartY.current;
    if (moveAxis.current === "none") {
      if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
        moveAxis.current = Math.abs(dx) > Math.abs(dy) ? "x" : "y";
      }
    }
    if (moveAxis.current === "x") {
      setDragX(dx);
    }
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    // Other touches still active (pinch in progress, lifted only one finger):
    // don't treat this as end-of-swipe.
    if (e.touches.length > 0) {
      resetTouch();
      return;
    }

    const isHorizontal = moveAxis.current === "x";
    const movedFar = Math.abs(dragX) > 20 || moveAxis.current === "y";

    if (isHorizontal && total > 1) {
      if (dragX > SWIPE_THRESHOLD) prev();
      else if (dragX < -SWIPE_THRESHOLD) next();
    } else if (!movedFar && current.type === "image") {
      setShowInfo((v) => !v);
    }

    resetTouch();
  };

  const setLoaded = useCallback((i: number) => {
    setImgLoaded((m) => (m[i] ? m : { ...m, [i]: true }));
  }, []);

  const isLoaded = (i: number) => imgLoaded[i] === true;

  const imgConstraints =
    "max-w-[calc(100vw-5rem)] max-h-[calc(100dvh-7rem)] md:max-w-[calc(100vw-10rem)] md:max-h-[calc(100dvh-7rem)]";

  // Caption is visible if user is hovering (desktop) or has tapped to show (mobile)
  const captionVisible = hoveringImage || showInfo;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 animate-fade-in overscroll-contain"
      role="dialog"
      aria-modal="true"
      onClick={closeOnBackdrop}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label={t("lightboxClose")}
        className="absolute top-3 right-3 md:top-6 md:right-8 z-30 w-10 h-10 md:w-12 md:h-12 text-white hover:opacity-70 transition-opacity"
      >
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <path d="M5 5l18 18M23 5L5 23" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label={t("carouselPrev")}
            className="hidden md:flex absolute left-1 md:left-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 text-white hover:opacity-70 transition-opacity items-center justify-center"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M18 4L8 14l10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            onClick={next}
            aria-label={t("carouselNext")}
            className="hidden md:flex absolute right-1 md:right-6 top-1/2 -translate-y-1/2 z-30 w-10 h-10 md:w-12 md:h-12 text-white hover:opacity-70 transition-opacity items-center justify-center"
          >
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <path d="M10 4l10 10-10 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </>
      )}

      {/* Slider track. touch-none disables browser touch defaults so the JS
          handles swipe and the page underneath does NOT scroll. */}
      <div
        className="absolute inset-0 overflow-hidden touch-none"
        onClick={closeOnBackdrop}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        onMouseEnter={() => setHoveringImage(true)}
        onMouseLeave={() => setHoveringImage(false)}
      >
        <div
          className={`absolute inset-0 flex ${
            dragging ? "" : "transition-transform duration-300 ease-out"
          }`}
          style={{
            transform: `translate3d(calc(${-index * 100}% + ${dragX}px), 0, 0)`,
          }}
        >
          {items.map((it, i) => (
            <div
              key={i}
              className="relative shrink-0 w-full h-full flex items-center justify-center px-10 md:px-20 py-14 md:py-16"
            >
              {it.type === "video" ? (
                <div
                  className="relative bg-black"
                  style={{
                    width: "min(85vw, calc((100dvh - 7rem) * 16 / 9))",
                    aspectRatio: "16 / 9",
                  }}
                >
                  {i === index && (
                    <iframe
                      src={`https://www.youtube.com/embed/${it.videoId}?rel=0&modestbranding=1`}
                      title={it.title}
                      className="absolute inset-0 w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  )}
                </div>
              ) : it.src ? (
                <div className="relative inline-block">
                  {!isLoaded(i) && (
                    <div className={`${imgConstraints} aspect-[4/5] bg-zinc-700/40 animate-pulse rounded-sm`} />
                  )}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    ref={(img) => {
                      if (img && img.complete && img.naturalWidth > 0) setLoaded(i);
                    }}
                    src={it.src}
                    srcSet={it.srcset}
                    sizes="100vw"
                    alt={it.alt ?? it.title}
                    draggable={false}
                    onLoad={() => setLoaded(i)}
                    onError={() => setLoaded(i)}
                    className={`block ${imgConstraints} w-auto h-auto select-none transition-opacity duration-300 ${
                      isLoaded(i) ? "opacity-100" : "opacity-0 absolute inset-0"
                    }`}
                  />
                </div>
              ) : (
                <div className="w-[72vw] max-w-md aspect-[3/4] bg-zinc-300/90 flex items-center justify-center px-4 text-zinc-700 text-sm uppercase tracking-widest text-center">
                  {it.title}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Caption: hidden by default. Desktop = visible on hover. Mobile = visible on tap. */}
      {(current.type === "video" || isLoaded(index)) && (
        <div
          className={`pointer-events-none absolute bottom-0 left-0 right-0 z-20 px-4 py-4 md:px-10 md:py-7 bg-gradient-to-t from-black/95 via-black/85 to-black/0 text-white transition-opacity duration-300 ${
            captionVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-4xl mx-auto">
            <h3 className="text-base md:text-lg font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {current.title}
            </h3>
            {current.meta && (
              <p className="text-sm md:text-base opacity-90 mt-1 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
                {current.meta}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
