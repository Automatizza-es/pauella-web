import { siteConfig } from "./site-config";
import { en } from "./i18n/en";

export function getCateringBusinessSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "CateringBusiness",
    name: siteConfig.name,
    description: siteConfig.description,
    url: siteConfig.url,
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
      name: en.menu.title,
      hasMenuSection: [
        {
          "@type": "MenuSection",
          name: en.paellas.name,
          hasMenuItem: en.paellas.items.map((paella) => ({
            "@type": "MenuItem",
            name: paella.name,
            description: paella.description,
          })),
        },
        {
          "@type": "MenuSection",
          name: en.specials.name,
          hasMenuItem: en.specials.items.map((paella) => ({
            "@type": "MenuItem",
            name: paella.name,
            description: paella.description,
          })),
        },
      ],
    },
  };
}
