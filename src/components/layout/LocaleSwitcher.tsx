"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import { localePaths } from "@/lib/locale-seo";
import { translatedHash } from "@/lib/paella-identity";
import { saveLanguageChoices } from "@/lib/useLanguageChoices";
import { saveLanguageDrafts } from "@/lib/language-drafts";
import { saveInterestedPaellas } from "@/lib/useInterestedPaella";

export default function LocaleSwitcher({ solid }: { solid: boolean }) {
  const { locale } = useLocale();
  const [hash, setHash] = useState("");
  useEffect(() => {
    const update = () => setHash(window.location.hash);
    update();
    // Next's fragment Links use history.pushState, which does not fire hashchange.
    const onAnchorClick = (event: globalThis.MouseEvent) => {
      const link = (event.target as Element).closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const url = new URL(link.href);
      if (url.origin === location.origin && url.pathname === location.pathname) setHash(url.hash);
    };
    window.addEventListener("hashchange", update);
    window.addEventListener("popstate", update);
    document.addEventListener("click", onAnchorClick, true);
    return () => {
      window.removeEventListener("hashchange", update);
      window.removeEventListener("popstate", update);
      document.removeEventListener("click", onAnchorClick, true);
    };
  }, []);

  function navigate(event: MouseEvent<HTMLAnchorElement>, code: Locale) {
    event.currentTarget.href = `${localePaths[code]}${translatedHash(window.location.hash, code)}`;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (code === locale) {
      event.preventDefault();
      return;
    }
    if (document.querySelector('form[data-submitting="true"]')) {
      event.preventDefault();
      window.alert(locale === "en"
        ? "Please wait for your request to finish before changing language."
        : "Espera a que termine el envío antes de cambiar de idioma.");
      return;
    }
    // New tabs intentionally start clean; preserve normal browser link semantics.
    try {
      saveLanguageDrafts();
      saveInterestedPaellas();
      saveLanguageChoices();
    } catch {
      const message = locale === "en"
        ? "Your browser cannot preserve your form or selection when changing language. Continue?"
        : "Tu navegador no puede conservar el formulario o la selección al cambiar de idioma. ¿Continuar?";
      if (!window.confirm(message)) event.preventDefault();
    }
  }

  const base = solid ? "text-charcoal" : "text-shell";
  const muted = solid ? "text-charcoal/40" : "text-shell/50";
  const option = (code: Locale, label: string) => (
    <a
      href={`${localePaths[code]}${translatedHash(hash, code)}`}
      hrefLang={code}
      lang={code}
      aria-current={locale === code ? "page" : undefined}
      onClick={(event) => navigate(event, code)}
      className={`transition-colors ${locale === code ? base : `${muted} hover:${base}`}`}
    >
      {label}
    </a>
  );
  return (
    <div className={`flex items-center gap-1.5 text-[0.7rem] font-bold uppercase tracking-[0.14em] ${base}`} aria-label={locale === "en" ? "Language" : "Idioma"}>
      {option("en", "EN")}
      <span className={muted}>/</span>
      {option("es", "ES")}
    </div>
  );
}
