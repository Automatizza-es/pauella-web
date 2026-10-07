"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import { siteConfig } from "@/lib/site-config";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Footer() {
  const { dict } = useLocale();

  const navLinks = [
    { label: dict.nav.menu, href: "#menu" },
    { label: dict.nav.extras, href: "#extras" },
    { label: dict.nav.photoVideo, href: "#photo-video" },
    { label: dict.nav.about, href: "#about" },
    { label: dict.nav.contact, href: "#contact" },
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
