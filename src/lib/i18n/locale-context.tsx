"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { dictionaries, type Dictionary, type Locale } from "./dictionaries";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  dict: Dictionary;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    // Server always renders "en" (no localStorage access during SSR), so the
    // stored preference must be applied post-mount to avoid a hydration
    // mismatch — this is a deliberate exception to react-hooks/set-state-in-effect.
    const stored = window.localStorage.getItem("mm_locale");
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (stored === "en" || stored === "fr") setLocaleState(stored);
  }, []);

  const setLocale = (next: Locale) => {
    setLocaleState(next);
    window.localStorage.setItem("mm_locale", next);
  };

  const value = useMemo(
    () => ({ locale, setLocale, dict: dictionaries[locale] }),
    [locale]
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
