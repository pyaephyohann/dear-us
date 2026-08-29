"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
} from "react";
import type { Language, TFunction } from "./types";
import { en } from "./en";
import { my } from "./my";

// ---------------------------------------------------------------------------
// Dictionaries
// ---------------------------------------------------------------------------

const dictionaries: Record<Language, Record<string, string>> = {
  en,
  my,
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

interface I18nContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TFunction;
}

const I18nContext = createContext<I18nContextValue | null>(null);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STORAGE_KEY = "dearus-lang";

function readStoredLanguage(): Language {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "my") return "my";
  } catch {
    // localStorage unavailable
  }
  return "en";
}

function interpolate(
  value: string,
  params?: Record<string, string | number>
): string {
  if (!params) return value;
  let result = value;
  for (const [k, v] of Object.entries(params)) {
    result = result.replace(new RegExp(`\\{${k}\\}`, "g"), String(v));
  }
  return result;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // Initialize from localStorage synchronously on client; returns "en" on server
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    return readStoredLanguage();
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  }, []);

  const t: TFunction = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      const dict = dictionaries[language];
      const raw = dict[key] ?? dictionaries.en[key] ?? key;
      return interpolate(raw, params);
    },
    [language]
  );

  const value: I18nContextValue = { language, setLanguage, t };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useTranslation(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (ctx) return ctx;

  // Outside provider — return English defaults
  return {
    language: "en",
    setLanguage: () => {},
    t: (key: string, params?: Record<string, string | number>) => {
      const raw = en[key] ?? key;
      return interpolate(raw, params);
    },
  };
}
