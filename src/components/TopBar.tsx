"use client";

import SkullButton from "./SkullButton";
import LangToggle from "./LangToggle";

export default function TopBar() {
  return (
    <div className="flex items-center justify-between gap-4">
      <SkullButton />
      <span className="flex-1 text-center text-2xl md:text-2xl xl:text-4xl font-bold tracking-tight truncate">
        Luca Guidotti
      </span>
      <LangToggle />
    </div>
  );
}
