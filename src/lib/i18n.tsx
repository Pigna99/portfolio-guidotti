"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

export type Lang = "it" | "en";

const dict = {
  it: {
    introDevelopedBy: "Sviluppato da",

    navOpere: "Opere",
    navEsposizioni: "Esposizioni",
    navAbout: "About",
    navContatti: "Contatti",

    holdToReturn: "Tieni premuto il teschio 2s per tornare alla home iniziale",

    aboutStatement:
      "[Statement artistico — placeholder. Inserire qui il testo dello statement di Luca Guidotti.]",
    aboutBio:
      "[Bio / CV — placeholder. Inserire qui la biografia, gli studi, le residenze e gli highlight di carriera.]",
    aboutCv: "Scarica CV (PDF)",
    aboutPortfolio: "Scarica Portfolio (PDF)",
    aboutPortraitAlt: "Ritratto fotografico di Luca Guidotti",

    contattiEmail: "Email",
    contattiPhone: "Telefono",
    contattiAddress: "Indirizzo",
    contattiPiva: "Partita IVA",

    operePlaceholderTitle: "Titolo opera",
    esposizioniPlaceholder: "Titolo mostra — Luogo",

    carouselPrev: "Precedente",
    carouselNext: "Successiva",
    carouselPlay: "Riproduci",
    carouselPause: "Pausa",

    lightboxClose: "Chiudi",

    placeholderImage: "Immagine in arrivo",
    placeholderSkull: "teschio",
    placeholderPortrait: "Ritratto",
    placeholderStudio: "Foto studio / disegno",

    socialMail: "Mail",
  },
  en: {
    introDevelopedBy: "Developed by",

    navOpere: "Works",
    navEsposizioni: "Exhibitions",
    navAbout: "About",
    navContatti: "Contacts",

    holdToReturn: "Hold the skull for 2s to return to the intro screen",

    aboutStatement:
      "[Artist statement — placeholder. Insert Luca Guidotti's statement here.]",
    aboutBio:
      "[Bio / CV — placeholder. Insert biography, education, residencies and career highlights here.]",
    aboutCv: "Download CV (PDF)",
    aboutPortfolio: "Download Portfolio (PDF)",
    aboutPortraitAlt: "Portrait photograph of Luca Guidotti",

    contattiEmail: "Email",
    contattiPhone: "Phone",
    contattiAddress: "Address",
    contattiPiva: "VAT number",

    operePlaceholderTitle: "Artwork title",
    esposizioniPlaceholder: "Exhibition title — Venue",

    carouselPrev: "Previous",
    carouselNext: "Next",
    carouselPlay: "Play",
    carouselPause: "Pause",

    lightboxClose: "Close",

    placeholderImage: "Image coming soon",
    placeholderSkull: "skull",
    placeholderPortrait: "Portrait",
    placeholderStudio: "Studio photo / drawing",

    socialMail: "Mail",
  },
} as const;

export type DictKey = keyof (typeof dict)["it"];

interface I18nContextValue {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: DictKey) => string;
}

const I18nContext = createContext<I18nContextValue | null>(null);

const STORAGE_KEY = "guidotti-lang";

function detectInitialLang(): Lang {
  if (typeof window === "undefined") return "it";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === "it" || stored === "en") return stored;
  const browser = window.navigator.language?.toLowerCase() ?? "";
  return browser.startsWith("it") ? "it" : "en";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("it");

  useEffect(() => {
    setLangState(detectInitialLang());
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, l);
    }
  };

  const toggleLang = () => setLang(lang === "it" ? "en" : "it");

  const t = (key: DictKey) => dict[lang][key];

  return (
    <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
