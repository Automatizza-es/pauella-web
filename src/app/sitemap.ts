import type { MetadataRoute } from "next";
import { languageAlternates } from "@/lib/locale-seo";

export default function sitemap(): MetadataRoute.Sitemap {
  return (["en", "es"] as const).map((locale) => ({
    url: languageAlternates[locale],
    alternates: { languages: languageAlternates },
  }));
}
