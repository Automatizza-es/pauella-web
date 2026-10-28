import type { Locale } from "./i18n";
import { siteConfig } from "./site-config";

export const pagePaths = {
  home: { en: "/", es: "/es/" },
  classes: { en: "/paella-cooking-classes-los-angeles/", es: "/es/clases-de-paella-los-angeles/" },
} satisfies Record<string, Record<Locale, string>>;
export type PageId = keyof typeof pagePaths;

export function pageFromPath(path: string | null): PageId {
  const normalized = `${(path || "/").replace(/\/$/, "")}/`;
  return Object.values(pagePaths.classes).some((value) => value === normalized) ? "classes" : "home";
}

export function pageAlternates(page: PageId) {
  return {
    en: `${siteConfig.url}${pagePaths[page].en}`,
    es: `${siteConfig.url}${pagePaths[page].es}`,
    "x-default": `${siteConfig.url}${pagePaths[page].en}`,
  };
}
