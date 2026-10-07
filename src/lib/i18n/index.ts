import { en } from "./en";
import { es } from "./es";
import type { Dictionary, Locale } from "./types";

export const dictionaries: Record<Locale, Dictionary> = { en, es };
export const defaultLocale: Locale = "en";
export const locales: Locale[] = ["en", "es"];
export type { Dictionary, Locale };
