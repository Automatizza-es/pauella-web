import { Newsreader, Inter } from "next/font/google";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { LocaleProvider } from "@/components/providers/LocaleProvider";
import type { Locale } from "@/lib/i18n";
import "@/app/globals.css";

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

export default function SiteLayout({
  children, locale,
}: Readonly<{
  children: React.ReactNode; locale: Locale;
}>) {
  return (
    <html lang={locale} className={`${newsreader.variable} ${inter.variable}`}>
      <body>
        <LocaleProvider locale={locale}>
          <Header />
          <main>{children}</main>
          <Footer />
        </LocaleProvider>
      </body>
    </html>
  );
}
