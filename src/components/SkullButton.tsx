"use client";

import { useRef } from "react";
import { useApp } from "@/app/AppShell";
import { useNavigateWithTransition } from "@/lib/view-transition";

interface Props {
  size?: "sm" | "lg";
  className?: string;
}

const HOLD_MS = 2000;

export default function SkullButton({
  size = "sm",
  className = "",
}: Props) {
  const navigate = useNavigateWithTransition();
  const { showIntro } = useApp();
  const timerRef = useRef<number | null>(null);
  const heldRef = useRef(false);

  const startHold = () => {
    heldRef.current = false;
    timerRef.current = window.setTimeout(() => {
      heldRef.current = true;
      showIntro();
    }, HOLD_MS);
  };

  const cancelHold = () => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleClick = () => {
    if (heldRef.current) {
      heldRef.current = false;
      return;
    }
    navigate("/");
  };

  const dim =
    size === "lg"
      ? "w-[19rem] md:w-[28rem] max-w-full h-auto"
      : "w-20 md:w-24 h-auto";

  return (
    <button
      type="button"
      onClick={handleClick}
      onMouseDown={startHold}
      onMouseUp={cancelHold}
      onMouseLeave={cancelHold}
      onTouchStart={startHold}
      onTouchEnd={cancelHold}
      onTouchCancel={cancelHold}
      onContextMenu={(e) => e.preventDefault()}
      aria-label="Home — tieni premuto per tornare all'intro"
      className={`select-none hover:opacity-70 transition-opacity ${className}`}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/skull.png"
        alt=""
        draggable={false}
        className={`${dim} pointer-events-none`}
      />
    </button>
  );
}
