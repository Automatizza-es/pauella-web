"use client";

import { useSyncExternalStore } from "react";

// Tracks which dish(es) someone clicked "Ask about this one" on, so the
// contact form below can carry that context along without the visitor
// having to retype it. More than one can stack up — the site itself
// suggests mixing two pans for larger groups. Plain in-memory store (no
// persistence) — it's only meant to survive the scroll from a dish row
// down to the contact form in the same session, not across reloads.
type Listener = () => void;
const listeners = new Set<Listener>();
const EMPTY: string[] = [];
let current: string[] = EMPTY;

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
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
  current = current.includes(name) ? current.filter((n) => n !== name) : [...current, name];
  notify();
}

// Unlike the dish rows, the cooking-class CTA only ever adds: it's a
// one-way "take me to the form" button, so a second click shouldn't
// silently undo the first.
export function addInterestedPaella(name: string) {
  if (current.includes(name)) return;
  current = [...current, name];
  notify();
}

// Stored as a fixed key rather than a label so the chip follows the
// language switcher; ContactForm turns it into dict.contact.form.cookingClass.
export const COOKING_CLASS = "cooking-class";

export function removeInterestedPaella(name: string) {
  current = current.filter((n) => n !== name);
  notify();
}

export function clearInterestedPaella() {
  current = EMPTY;
  notify();
}

export function useInterestedPaella() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

// Turns a dish name into the id its row is anchored with (e.g. "The
// Señorito" -> "paella-the-senorito"), so "+ Add another paella" can jump
// back to exactly the row someone was looking at instead of the top of
// the whole menu chapter.
export function paellaSlug(name: string): string {
  return (
    "paella-" +
    name
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  );
}
