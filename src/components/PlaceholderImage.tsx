interface Props {
  label?: string;
  src?: string;
  alt?: string;
  className?: string;
  aspect?: "square" | "portrait" | "landscape" | "auto";
}

export default function PlaceholderImage({
  label = "Placeholder",
  src,
  alt = "",
  className = "",
  aspect = "auto",
}: Props) {
  const aspectClass =
    aspect === "square"
      ? "aspect-square"
      : aspect === "portrait"
      ? "aspect-[3/4]"
      : aspect === "landscape"
      ? "aspect-[16/9]"
      : "";

  if (src) {
    return (
      <div
        className={`relative w-full h-full ${aspectClass} bg-black/5 overflow-hidden ${className}`}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 w-full h-full object-cover"
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
