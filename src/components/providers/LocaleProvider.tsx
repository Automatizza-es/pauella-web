"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import { defaultLocale, dictionaries, locales } from "@/lib/i18n";
import type { Dictionary, Locale } from "@/lib/i18n";

const STORAGE_KEY = "pauella-locale";

type Listener = () => void;
const listeners = new Set<Listener>();
let cachedLocale: Locale = defaultLocale;
let hydratedFromStorage = false;

function readStoredLocale(): Locale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && locales.includes(stored as Locale)) return stored as Locale;
  } catch {
    // localStorage unavailable — fall back to default locale
  }
  return defaultLocale;
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot(): Locale {
  if (!hydratedFromStorage) {
    cachedLocale = readStoredLocale();
    hydratedFromStorage = true;
  }
  return cachedLocale;
}

function getServerSnapshot(): Locale {
  return defaultLocale;
}

function writeLocale(next: Locale) {
  cachedLocale = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore write failures (private browsing, etc.)
  }
  listeners.forEach((listener) => listener());
}

const LocaleContext = createContext<{
  locale: Locale;
  dict: Dictionary;
  setLocale: (locale: Locale) => void;
} | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  const value = useMemo(
    () => ({ locale, dict: dictionaries[locale], setLocale: writeLocale }),
    [locale],
  );

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
