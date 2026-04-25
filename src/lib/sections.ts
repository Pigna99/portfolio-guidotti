export type NavSection = "opere" | "esposizioni" | "about" | "contatti";
export type ActiveSection = NavSection | "home";

export const NAV_ITEMS: NavSection[] = ["opere", "esposizioni", "about", "contatti"];

export const ROUTES: Record<NavSection, string> = {
  opere: "/opere",
  esposizioni: "/esposizioni",
  about: "/about",
  contatti: "/contatti",
};

export function pathToSection(pathname: string | null): ActiveSection {
  if (!pathname || pathname === "/") return "home";
  const slug = pathname.split("/")[1] as NavSection;
  if (NAV_ITEMS.includes(slug)) return slug;
  return "home";
}
