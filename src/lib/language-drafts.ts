"use client";

import { useEffect, useRef } from "react";

const KEY = "pauella-language-drafts";
type Drafts = Record<string, Record<string, string>>;

// Save only on an explicit language navigation, not on every keystroke.
// Data stays in this tab and is consumed by the destination form.
export function saveLanguageDrafts() {
  const drafts: Drafts = {};
  document.querySelectorAll<HTMLFormElement>("form[data-draft]").forEach((form) => {
    const values: Record<string, string> = {};
    for (const [name, value] of new FormData(form)) {
      const input = form.elements.namedItem(name);
      if (typeof value === "string" && !(input instanceof HTMLInputElement && input.type === "hidden")) {
        values[name] = value;
      }
    }
    drafts[form.dataset.draft!] = values;
  });
  sessionStorage.setItem(KEY, JSON.stringify(drafts));
}

export function useLanguageDraft(id: string) {
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    try {
      const drafts: Drafts = JSON.parse(sessionStorage.getItem(KEY) || "{}");
      for (const [name, value] of Object.entries(drafts[id] || {})) {
        const input = ref.current?.elements.namedItem(name);
        if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement || input instanceof HTMLSelectElement) {
          if (typeof value === "string") input.value = value;
        }
      }
      delete drafts[id];
      if (Object.keys(drafts).length) sessionStorage.setItem(KEY, JSON.stringify(drafts));
      else sessionStorage.removeItem(KEY);
    } catch { /* No storage or no draft: use the normal empty form. */ }
  }, [id]);
  return ref;
}
