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
    introVisualArtist: "Visual Artist",

    navOpere: "Opere",
    navEsposizioni: "Esposizioni",
    navAbout: "About",
    navContatti: "Contatti",

    holdToReturn: "Tieni premuto il teschio 2s per tornare alla home iniziale",

    aboutStatement: `La pittura di Luca Guidotti si focalizza sull’espressività. Questa, resa con colori
accesi e segni graffiati, enfatizza una lettura grottesca della vita: immagini crude,
poco allegre, ma vivaci.
Secondo Luca, l’arte è una seduta terapeutica con sé stessi: la terapia è una forma
di conforto, una palestra contro il dolore, la manifestazione del desiderio di
riconciliazione con i mostri interiori e le maschere che si indossa per apparire in un
certo modo.
Una delle questioni che a Luca sono più care è il memento mori, cioè la persistenza
dell’idea di morte nella vita attraverso le manifestazioni di quest’ultima - la natura, il
ritratto, il sesso.
Luca fa proprie le tecniche del disegno e della pittura.
Pittura e disegno si sovrappongono, ma non troppo. Il disegno è ambiguo, perché
in certi casi è studiato e preparato, mentre in altri è lasciato all’improvvisazione, allo
sfogo, alle dichiarazioni forti abbandonate a sé stesse e fatte di politica, passioni e
abnegazioni. La pittura, d’altro canto, tende a essere una massa corporea di colore;
il disegno cede la sua confezionata linearità al gesto pittorico disinvolto, al tono di
voce ingordo, sornione e che soffre i limiti tecnici del medium. La pittura chiede di
essere data velocemente, è poco domesticata e, per questo, impulsiva.`,
    aboutBio: `Luca Guidotti nasce a San Benedetto del Tronto nel 1999.
Nel 2024 consegue il Diploma accademico di II livello in Pittura Arti visive
contemporanee all’Accademia di belle arti di Urbino.
Dal 2020 lavora nel suo studio ed è impegnato in mostre d’arte contemporanea.`,
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
    introVisualArtist: "Visual Artist",

    navOpere: "Works",
    navEsposizioni: "Exhibitions",
    navAbout: "About",
    navContatti: "Contacts",

    holdToReturn: "Hold the skull for 2s to return to the intro screen",

    aboutStatement: `Luca Guidotti’s painting focuses on expression. Rendered through bright colours
and scratchy marks, his art emphasises a grotesque interpretation of life: raw,
sombre yet vivid images.
For Luca, art is a therapeutic process the artist apply to himself: therapy is a form of
comfort, a training ground against pain; it’s the manifestation of a desire for
reconciliation with one’s inner demons and the masks he wears to appear a certain
way.
One of the issues closest to Luca’s art is the memento mori, which is
the concept of death being persistent in life through its manifestations –
nature, portraiture, sex.
Luca adopts the techniques of drawing and painting.
Painting and drawing overlap, but not at all. The drawings are ambiguous
because in some cases they are carefully planned and prepared, whilst
in others they’re left to improvisation, to an outpouring of emotion, to
powerful statements left to their own devices and shaped by politics,
passions and self-sacrifice. The paintings, on the other hand, tend to
be a physical mass of colour; drawing yields its structured linearity to
the casual painterly gesture, to a tone of voice that is greedy, sly and
constrained by the technical limits of the medium. Painting demands to
be executed swiftly; it is untamed and, for this reason, impulsive.`,
    aboutBio: `Luca Guidotti is born in San Benedetto del Tronto, Italy, in 1999.
He had a Master Degree in Painting Visual Contemporary Arts in the Academy of
Fine Arts in Urbino (IT).
Since 2020, he’s working in his studio and participating to contemporary art
exhibitions.`,
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
