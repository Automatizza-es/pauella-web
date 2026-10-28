"use client";

import { useMemo, useSyncExternalStore } from "react";

import { useLocale } from "@/components/providers/LocaleProvider";
import { dishKey, dishLabel, isDishKey } from "./paella-identity";
export { paellaSlug } from "./paella-identity";

// Stable dish keys survive language changes without depending on translated names.
type Listener = () => void;
const listeners = new Set<Listener>();
const EMPTY: string[] = [];
let current: string[] = EMPTY;
let restored = false;
const STORAGE_KEY = "pauella-language-selection";

export function saveInterestedPaellas() {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(getSnapshot()));
}

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!restored) {
    restored = true;
    try {
      const saved: unknown = JSON.parse(sessionStorage.getItem(STORAGE_KEY) || "null");
      if (Array.isArray(saved) && saved.every((key) => typeof key === "string" && (key === "cooking-class" || isDishKey(key)))) current = saved;
      sessionStorage.removeItem(STORAGE_KEY);
    } catch { /* Storage is optional; the URL still determines language. */ }
  }
  return current;
}

function getServerSnapshot(): string[] {
  return EMPTY;
}

function notify() {
  listeners.forEach((listener) => listener());
}

// Clicking a dish already in the list removes it — same toggle feel as
// the tag chips elsewhere on the site, and a quick way to undo a mistaken
// click without having to scroll down to the contact form to remove it.
export function toggleInterestedPaella(name: string) {
  name = dishKey(name);
  current = current.includes(name) ? current.filter((n) => n !== name) : [...current, name];
  notify();
}

// Unlike the dish rows, the cooking-class CTA only ever adds: it's a
// one-way "take me to the form" button, so a second click shouldn't
// silently undo the first.
export function addInterestedPaella(name: string) {
  name = dishKey(name);
  if (current.includes(name)) return;
  current = [...current, name];
  notify();
}

// Stored as a fixed key rather than a label so the chip follows the
// language switcher; ContactForm turns it into dict.contact.form.cookingClass.
export const COOKING_CLASS = "cooking-class";

export function removeInterestedPaella(name: string) {
  name = dishKey(name);
  current = current.filter((n) => n !== name);
  notify();
}

export function clearInterestedPaella() {
  current = EMPTY;
  notify();
}

export function useInterestedPaella() {
  const { locale } = useLocale();
  const keys = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return useMemo(() => keys.map((key) => dishLabel(key, locale)), [keys, locale]);
}
