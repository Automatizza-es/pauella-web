"use client";

import { useSyncExternalStore } from "react";

import { dictionaries } from "./i18n";
import { isDishKey } from "./paella-identity";

type Choices = Record<string, boolean | number[]>;
const EMPTY: Choices = {};
let choices: Choices = EMPTY;
let restored = false;
const listeners = new Set<() => void>();
const KEY = "pauella-language-choices";

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => { listeners.delete(listener); };
}
function snapshot() {
  if (!restored) {
    restored = true;
    try {
      const saved = JSON.parse(sessionStorage.getItem(KEY) || "{}");
      if (saved && typeof saved === "object" && !Array.isArray(saved)) {
        choices = Object.fromEntries(Object.entries(saved).filter(([key, value]) =>
          (key === "custom-tags" && Array.isArray(value) && value.every((index) => Number.isInteger(index) && index >= 0 && index < dictionaries.en.customIdea.tags.length)) ||
          ((key.startsWith("black-") && isDishKey(key.slice(6))) && typeof value === "boolean"),
        )) as Choices;
      }
      sessionStorage.removeItem(KEY);
    } catch { /* Optional tab-scoped storage. */ }
  }
  return choices;
}
export function saveLanguageChoices() {
  sessionStorage.setItem(KEY, JSON.stringify(choices));
}
export function useLanguageChoice<T extends boolean | number[]>(key: string, initial: T) {
  const current = useSyncExternalStore(subscribe, snapshot, () => EMPTY);
  const value = (current[key] ?? initial) as T;
  function setValue(update: T | ((previous: T) => T)) {
    const previous = (choices[key] ?? initial) as T;
    choices = { ...choices, [key]: typeof update === "function" ? update(previous) : update };
    listeners.forEach((listener) => listener());
  }
  return [value, setValue] as const;
}
