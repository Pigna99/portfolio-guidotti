"use client";

import { useState } from "react";

interface Props {
  label?: string;
  src?: string;
  srcset?: string;
  sizes?: string;
  alt?: string;
  className?: string;
  aspect?: "square" | "portrait" | "landscape" | "auto";
  fit?: "cover" | "contain";
}

export default function PlaceholderImage({
  label = "Placeholder",
  src,
  srcset,
  sizes,
  alt = "",
  className = "",
  aspect = "auto",
  fit = "cover",
}: Props) {
  const [loaded, setLoaded] = useState(false);

  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "portrait"
      ? "aspect-[3/4]"
      : aspect === "landscape"
      ? "aspect-[16/9]"
      : "";

  const fitClass = fit === "contain" ? "object-contain" : "object-cover";

  if (src) {
    return (
      <div
        className={`relative w-full h-full ${aspectClass} bg-black/5 overflow-hidden ${className}`}
      >
        {!loaded && (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-black/10 via-black/5 to-black/15" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          srcSet={srcset}
          sizes={sizes}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`absolute inset-0 w-full h-full ${fitClass} transition-opacity duration-300 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full ${aspectClass} bg-black/5 border border-black/30 flex items-center justify-center overflow-hidden ${className}`}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, transparent, transparent 12px, rgba(0,0,0,0.06) 12px, rgba(0,0,0,0.06) 13px)",
        }}
      />
      <span className="relative text-xs uppercase tracking-widest text-black/60 select-none px-3 text-center">
        {label}
      </span>
    </div>
  );
}
