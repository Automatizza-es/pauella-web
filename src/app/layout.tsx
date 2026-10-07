import type { Metadata } from "next";
import { Newsreader, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-serif-display",
  axes: ["opsz"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} | Live Paella Catering in Los Angeles`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "live paella catering Los Angeles",
    "paella catering Los Angeles",
    "paella chef Los Angeles",
    "paella catering for weddings",
    "paella catering for private parties",
    "paella catering for corporate events",
    "Spanish catering Los Angeles",
    "paella catering Southern California",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: `${siteConfig.name} | Live Paella Catering in Los Angeles`,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    images: [
      {
        url: "/images/hero-seaside.jpg",
        width: 1672,
        height: 941,
        alt: "Pau checking a giant paella cooking on a seaside promenade in Los Angeles",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} | Live Paella Catering in Los Angeles`,
    description: siteConfig.description,
    images: ["/images/hero-seaside.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${newsreader.variable} ${inter.variable}`}>
      <body>
        <LocaleProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
