import { siteConfig } from "./site-config";
import { dictionaries, type Locale } from "./i18n";
import { descriptions, languageAlternates } from "./locale-seo";

export function getCateringBusinessSchema(locale: Locale = "en") {
  const dict = dictionaries[locale];
  return {
    "@context": "https://schema.org",
    "@type": "CateringBusiness",
    name: siteConfig.name,
    description: descriptions[locale],
    url: languageAlternates[locale],
    image: `${siteConfig.url}/images/pau-sunset-paella.png`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    servesCuisine: "Spanish",
    priceRange: "$$$",
    sameAs: [siteConfig.instagram],
    areaServed: siteConfig.areaServed.map((name) => ({
      "@type": "City",
      name,
    })),
    hasMenu: {
      "@type": "Menu",
      name: dict.menu.title,
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: dict.paellas.name,
          hasMenuItem: dict.paellas.items.map((paella) => ({
            "@type": "MenuItem",
            name: paella.name,
            description: paella.description,
          })),
        },
        {
          "@type": "MenuSection",
          name: dict.specials.name,
          hasMenuItem: dict.specials.items.map((paella) => ({
            "@type": "MenuItem",
            name: paella.name,
            description: paella.description,
          })),
        },
      ],
    },
  };
}
