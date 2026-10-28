"use client";

import { usePathname } from "next/navigation";
import { pagePaths, pageFromPath } from "@/lib/page-routes";
import { classContent } from "@/lib/classes/content";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { siteConfig } from "@/lib/site-config";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Footer() {
  const { dict, locale } = useLocale();
  const isClassPage = pageFromPath(usePathname()) === "classes";
  const section = (id: string) => !isClassPage ? `#${id}`
    : id === "contact" ? "#class-enquiry" : id === "learn" ? "#class-overview" : `${pagePaths.home[locale]}#${id}`;

  const navLinks = [
    { label: dict.nav.menu, href: section("menu") },
    { label: dict.nav.extras, href: section("extras") },
    { label: dict.nav.learn, href: section("learn") },
    { label: dict.nav.about, href: section("about") },
    { label: dict.nav.contact, href: section("contact") },
    ...(!isClassPage ? [{ label: classContent[locale].footerLink, href: pagePaths.classes[locale] }] : []),
  ];

  return (
    <footer className="bg-charcoal py-12 text-shell/70">
      <Container className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div>
          <Image
            src="/images/logo/pauella-wordmark-white.png"
            alt="Pauella"
            width={873}
            height={187}
            className="mx-auto h-5 w-auto sm:mx-0"
          />
          <p className="mt-1 text-xs uppercase tracking-[0.14em]">{dict.hero.tagline}</p>
        </div>

        <nav className="flex flex-wrap items-center justify-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-xs font-medium uppercase tracking-[0.14em] hover:text-shell"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <p className="text-xs">
          © {new Date().getFullYear()} {siteConfig.name}. {dict.footer.rights}
        </p>
      </Container>
    </footer>
  );
}
