"use client";

import { useNavigateWithTransition } from "@/lib/view-transition";
import SkullButton from "./SkullButton";
import LangToggle from "./LangToggle";

export default function TopBar() {
  const navigate = useNavigateWithTransition();

  return (
    <div className="flex items-center justify-between gap-4">
      <SkullButton />
      <button
        type="button"
        onClick={() => navigate("/")}
        aria-label="Torna alla homepage"
        className="flex-1 text-center font-display text-2xl md:text-2xl xl:text-4xl tracking-tight truncate hover:opacity-70 transition-opacity"
      >
        Luca Guidotti
      </button>
      <LangToggle />
    </div>
  );
}
