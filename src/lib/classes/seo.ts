import type { Metadata } from "next";
import type { Locale } from "../i18n";
import { pageAlternates } from "../page-routes";
import { siteConfig } from "../site-config";
import { classContent } from "./content";

export function classMetadata(locale: Locale): Metadata {
  const content = classContent[locale];
  const languages = pageAlternates("classes");
  const image = { url: "/images/learn-rice-pour.jpg", width: 1448, height: 1086, alt: content.heroAlt };
  return {
    metadataBase: new URL(siteConfig.url), title: content.title, description: content.description,
    alternates: { canonical: languages[locale], languages },
    robots: { index: true, follow: true },
    openGraph: {
      title: content.title, description: content.description, url: languages[locale],
      siteName: siteConfig.name, type: "website", locale: locale === "en" ? "en_US" : "es_ES",
      alternateLocale: locale === "en" ? "es_ES" : "en_US", images: [image],
    },
    twitter: { card: "summary_large_image", title: content.title, description: content.description, images: [image] },
  };
}

export function classSchema(locale: Locale) {
  const content = classContent[locale];
  const url = pageAlternates("classes")[locale];
  const providerId = `${siteConfig.url}/#business`;
  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "Organization", "@id": providerId, name: siteConfig.name, url: `${siteConfig.url}/`,
        telephone: siteConfig.phone, email: siteConfig.email, sameAs: [siteConfig.instagram] },
      { "@type": "WebPage", "@id": `${url}#webpage`, url, name: content.title,
        description: content.description, inLanguage: locale, mainEntity: { "@id": `${url}#service` } },
      { "@type": "Service", "@id": `${url}#service`, url, name: content.h1,
        description: content.description, provider: { "@id": providerId },
        image: `${siteConfig.url}/images/learn-rice-pour.jpg`,
        areaServed: [{ "@type": "City", name: "Los Angeles" },
          { "@type": "Place", name: "Southern California", description: content.area }] },
      { "@type": "BreadcrumbList", itemListElement: [
        { "@type": "ListItem", position: 1, name: content.home, item: pageAlternates("home")[locale] },
        { "@type": "ListItem", position: 2, name: content.name, item: url },
      ] },
      { "@type": "FAQPage", inLanguage: locale, mainEntity: content.faq.map((faq) => ({
        "@type": "Question", name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })) },
    ],
  };
}
