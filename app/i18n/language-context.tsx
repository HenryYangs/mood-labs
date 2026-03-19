"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type Language = "en" | "zh";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  isLoaded: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

type LanguageProviderProps = {
  children: React.ReactNode;
};

const LANGUAGE_STORAGE_KEY = "mood-labs-language";

export function LanguageProvider({ children }: LanguageProviderProps): React.JSX.Element {
  const [language, setLanguage] = useState<Language>("en");
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    const storedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (storedLanguage === "zh" || storedLanguage === "en") {
      setLanguage(storedLanguage);
      setIsLoaded(true);
      return;
    }

    // Fallback to English when browser language is unavailable.
    const browserLanguage = window.navigator?.language;
    if (!browserLanguage) {
      setLanguage("en");
      setIsLoaded(true);
      return;
    }
    setLanguage(browserLanguage.toLowerCase().startsWith("zh") ? "zh" : "en");
    setIsLoaded(true);
  }, []);

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      isLoaded
    }),
    [language, isLoaded]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}
