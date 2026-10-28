import type { MetadataRoute } from "next";
import { pageAlternates, type PageId } from "@/lib/page-routes";

export default function sitemap(): MetadataRoute.Sitemap {
  return (["home", "classes"] as PageId[]).flatMap((page) => {
    const languages = pageAlternates(page);
    return (["en", "es"] as const).map((locale) => ({
      url: languages[locale], alternates: { languages },
    }));
  });
}
