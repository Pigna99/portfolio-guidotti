"use client";

import type { CSSProperties, MouseEvent } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n, type DictKey } from "@/lib/i18n";
import { useNavigateWithTransition } from "@/lib/view-transition";
import {
  NAV_ITEMS,
  ROUTES,
  pathToSection,
  type NavSection,
} from "@/lib/sections";

const NAV_KEYS: Record<NavSection, DictKey> = {
  opere: "navOpere",
  esposizioni: "navEsposizioni",
  about: "navAbout",
  contatti: "navContatti",
};

const vtStyle = (s: NavSection): CSSProperties => ({
  viewTransitionName: `nav-${s}`,
});

export default function MainNav() {
  const { t } = useI18n();
  const pathname = usePathname();
  const active = pathToSection(pathname);
  const navigate = useNavigateWithTransition();

  const handleClick = (e: MouseEvent<HTMLAnchorElement>, href: string) => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    navigate(href);
  };

  if (active === "home") {
    return (
      <ul className="flex flex-col gap-5 md:gap-7 xl:gap-9">
        {NAV_ITEMS.map((s) => (
          <li key={s}>
            <Link
              href={ROUTES[s]}
              onClick={(e) => handleClick(e, ROUTES[s])}
              style={vtStyle(s)}
              className="inline-block text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-black hover:text-rosso transition-colors leading-none"
            >
              {t(NAV_KEYS[s])}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  const others = NAV_ITEMS.filter((s) => s !== active);

  return (
    <div>
      <h1
        style={vtStyle(active)}
        className="inline-block text-5xl md:text-6xl xl:text-7xl font-bold tracking-tight text-black leading-none"
      >
        {t(NAV_KEYS[active])}
      </h1>
      <ul className="mt-4 md:mt-5 flex flex-wrap gap-x-4 gap-y-1 text-base md:text-lg font-bold">
        {others.map((s) => (
          <li key={s}>
            <Link
              href={ROUTES[s]}
              onClick={(e) => handleClick(e, ROUTES[s])}
              style={vtStyle(s)}
              className="inline-block text-black hover:text-rosso transition-colors"
            >
              {t(NAV_KEYS[s])}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
