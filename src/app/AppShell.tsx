"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import IntroScreen from "@/components/IntroScreen";

interface AppContextValue {
  showIntro: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppShell>");
  return ctx;
}

const STORAGE_KEY = "guidotti-intro-dismissed";
const EXIT_MS = 700;

type Phase = "loading" | "showing" | "exiting" | "hidden";

export default function AppShell({ children }: { children: ReactNode }) {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const dismissed =
      typeof window !== "undefined" && window.sessionStorage.getItem(STORAGE_KEY);
    setPhase(dismissed ? "hidden" : "showing");
  }, []);

  const dismissIntro = () => {
    if (phase !== "showing") return;
    window.sessionStorage.setItem(STORAGE_KEY, "1");
    setPhase("exiting");
    window.setTimeout(() => setPhase("hidden"), EXIT_MS);
  };

  const showIntro = () => {
    window.sessionStorage.removeItem(STORAGE_KEY);
    setPhase("showing");
  };

  const introMounted = phase === "showing" || phase === "exiting";

  return (
    <AppContext.Provider value={{ showIntro }}>
      {children}

      {introMounted && (
        <div
          className={`fixed inset-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] ${
            phase === "exiting"
              ? "opacity-0 scale-110 pointer-events-none"
              : "opacity-100 scale-100"
          }`}
        >
          <IntroScreen onEnter={dismissIntro} />
        </div>
      )}

      {phase === "loading" && (
        <div className="fixed inset-0 z-50 bg-rosso-vivo" />
      )}
    </AppContext.Provider>
  );
}
