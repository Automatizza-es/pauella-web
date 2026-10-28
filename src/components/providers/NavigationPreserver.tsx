"use client";
import { useEffect } from "react";
import { useLocale } from "./LocaleProvider";
import { saveLanguageDrafts } from "@/lib/language-drafts";
import { saveInterestedPaellas } from "@/lib/useInterestedPaella";
import { saveLanguageChoices } from "@/lib/useLanguageChoices";

// All internal page links (including home ↔ classes) preserve independent drafts.
// Capture runs before Next Link's client navigation and native anchor navigation.
export default function NavigationPreserver() {
  const { locale } = useLocale();
  useEffect(() => {
    function onClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(link instanceof HTMLAnchorElement) || link.target === "_blank" || link.hasAttribute("download")) return;
      const url = new URL(link.href);
      const path = (value: string) => value.replace(/\/$/, "") || "/";
      if (url.origin !== location.origin || path(url.pathname) === path(location.pathname)) return;
      function cancel() { event.preventDefault(); event.stopPropagation(); }
      if (document.querySelector('form[data-submitting="true"]')) {
        cancel();
        window.alert(locale === "en" ? "Please wait for your request to finish before leaving this page." : "Espera a que termine el envío antes de salir de esta página.");
        return;
      }
      try {
        saveLanguageDrafts();
        saveInterestedPaellas();
        saveLanguageChoices();
      } catch {
        const question = locale === "en"
          ? "Your browser cannot preserve your form or selection when leaving this page. Continue?"
          : "Tu navegador no puede conservar el formulario o la selección al salir de esta página. ¿Continuar?";
        if (!window.confirm(question)) cancel();
      }
    }
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [locale]);
  return null;
}
