import type { Metadata } from "next";
import type { Locale } from "./i18n";
import { siteConfig } from "./site-config";

export const localePaths: Record<Locale, string> = { en: "/", es: "/es/" };
export const languageAlternates = {
  en: `${siteConfig.url}/`,
  es: `${siteConfig.url}/es/`,
  "x-default": `${siteConfig.url}/`,
};
export const descriptions: Record<Locale, string> = {
  en: siteConfig.description,
  es: "Catering de paellas en directo en Los Ángeles. Pau cocina ante tus invitados en bodas, fiestas privadas y eventos de empresa por el sur de California.",
};

export function localeMetadata(locale: Locale): Metadata {
  const title = locale === "en"
    ? "Pauella | Live Paella Catering in Los Angeles"
    : "Pauella | Catering de Paellas en Los Ángeles";
  const url = languageAlternates[locale];
  return {
    metadataBase: new URL(siteConfig.url),
    title,
    description: descriptions[locale],
    keywords: locale === "en" ? [
      "live paella catering Los Angeles", "paella catering Los Angeles",
      "paella chef Los Angeles", "paella catering for weddings",
      "paella catering for private parties", "paella catering for corporate events",
      "Spanish catering Los Angeles", "paella catering Southern California",
    ] : [
      "catering de paellas Los Ángeles", "chef de paellas Los Ángeles",
      "paellas en directo", "catering para eventos sur de California",
    ],
    alternates: { canonical: url, languages: languageAlternates },
    robots: { index: true, follow: true },
    openGraph: {
      title, description: descriptions[locale], url, siteName: siteConfig.name,
      locale: locale === "en" ? "en_US" : "es_ES",
      alternateLocale: locale === "en" ? "es_ES" : "en_US",
      type: "website",
      images: [{
        url: "/images/hero-seaside.jpg", width: 1672, height: 941,
        alt: locale === "en"
          ? "Pau checking a giant paella cooking on a seaside promenade in Los Angeles"
          : "Pau prepara una gran paella junto al mar en Los Ángeles",
      }],
    },
    twitter: {
      card: "summary_large_image", title, description: descriptions[locale],
      images: ["/images/hero-seaside.jpg"],
    },
  };
}
