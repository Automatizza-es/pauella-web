"use client";

import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n";

export default function LocaleSwitcher({ solid }: { solid: boolean }) {
  const { locale, setLocale } = useLocale();

  const base = solid ? "text-charcoal" : "text-shell";
  const muted = solid ? "text-charcoal/40" : "text-shell/50";

  const option = (code: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(code)}
      aria-pressed={locale === code}
      className={`transition-colors ${locale === code ? base : `${muted} hover:${base}`}`}
    >
      {label}
    </button>
  );

  return (
    <div
      className={`flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] ${base}`}
      aria-label="Language"
    >
      {option("en", "EN")}
      <span className={muted}>/</span>
      {option("es", "ES")}
    </div>
  );
}
