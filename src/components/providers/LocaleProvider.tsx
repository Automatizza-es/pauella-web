"use client";

import { createContext, useContext, useMemo } from "react";
import { dictionaries } from "@/lib/i18n";
import type { Dictionary, Locale } from "@/lib/i18n";

const LocaleContext = createContext<{ locale: Locale; dict: Dictionary } | null>(null);

// The server route is the only source of truth. Stored/browser preferences
// never replace the URL language, before or after hydration.
export function LocaleProvider({ children, locale }: { children: React.ReactNode; locale: Locale }) {
  const value = useMemo(() => ({ locale, dict: dictionaries[locale] }), [locale]);
  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
