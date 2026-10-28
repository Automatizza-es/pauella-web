import { dictionaries, type Locale } from "./i18n";

export function dishNames(locale: Locale) {
  const dict = dictionaries[locale];
  return [...dict.paellas.items, ...dict.specials.items].map((item) => item.name);
}

export function dishKey(name: string): string {
  if (name === "cooking-class") return name;
  for (const locale of ["en", "es"] as const) {
    const index = dishNames(locale).indexOf(name);
    if (index >= 0) return `dish-${index}`;
  }
  return name;
}

export function isDishKey(key: string) {
  const match = /^dish-(\d+)$/.exec(key);
  return !!match && Number(match[1]) < dishNames("en").length;
}

export function dishLabel(key: string, locale: Locale): string {
  if (!key.startsWith("dish-")) return key;
  return dishNames(locale)[Number(key.slice(5))] || key;
}

export function paellaSlug(name: string): string {
  return "paella-" + name.normalize("NFD").replace(/[̀-ͯ]/g, "")
    .toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

export function translatedHash(hash: string, target: Locale): string {
  for (const locale of ["en", "es"] as const) {
    const index = dishNames(locale).findIndex((name) => `#${paellaSlug(name)}` === hash);
    if (index >= 0) return `#${paellaSlug(dishNames(target)[index])}`;
  }
  return hash;
}
