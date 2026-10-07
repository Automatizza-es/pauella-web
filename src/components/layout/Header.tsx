"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "./Container";
import LocaleSwitcher from "./LocaleSwitcher";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function Header() {
  const { dict } = useLocale();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  const leftLinks = [
    { label: dict.nav.menu, href: "#menu" },
    { label: dict.nav.extras, href: "#extras" },
    { label: dict.nav.learn, href: "#learn" },
  ];

  const rightLinks = [
    { label: dict.nav.about, href: "#about" },
    { label: dict.nav.contact, href: "#contact" },
  ];

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > window.innerHeight * 0.7);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        solid ? "bg-sand/95 shadow-[0_1px_0_rgba(28,26,22,0.08)] backdrop-blur-sm" : "bg-transparent"
      }`}
    >
      <div className="mx-auto w-full max-w-[100rem] px-6 sm:px-10 lg:px-14 xl:px-20">
        <div className="flex h-20 items-center justify-between lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-x-6 xl:gap-x-10">
          <nav className="hidden lg:flex items-center gap-4 xl:gap-5">
            {leftLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] transition-colors xl:tracking-[0.16em] ${
                  solid ? "text-charcoal hover:text-terracotta" : "text-shell hover:text-shell/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link href="#top" className="shrink-0 justify-self-center">
            <Image
              src={solid ? "/images/logo/pauella-wordmark-black.png" : "/images/logo/pauella-wordmark-white.png"}
              alt="Pauella"
              width={873}
              height={187}
              priority
              className="h-5 w-auto max-w-none"
            />
          </Link>

          <div className="hidden lg:flex items-center justify-end gap-4 xl:gap-5">
            {rightLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`shrink-0 whitespace-nowrap text-xs font-bold uppercase tracking-[0.12em] transition-colors xl:tracking-[0.16em] ${
                  solid ? "text-charcoal hover:text-terracotta" : "text-shell hover:text-shell/70"
                }`}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="#contact"
              className={`inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border px-4 py-2.5 text-xs font-bold uppercase tracking-[0.12em] xl:px-5 xl:tracking-[0.14em] transition-colors ${
                solid
                  ? "border-charcoal text-charcoal hover:bg-charcoal hover:text-shell"
                  : "border-shell/70 text-shell hover:bg-shell hover:text-charcoal"
              }`}
            >
              {dict.nav.bookEvent} <span aria-hidden>→</span>
            </Link>
            <span className={`h-3.5 w-px shrink-0 ${solid ? "bg-charcoal/20" : "bg-shell/30"}`} aria-hidden />
            <div className="shrink-0">
              <LocaleSwitcher solid={solid} />
            </div>
          </div>

          <div className="flex items-center gap-4 lg:hidden">
            <LocaleSwitcher solid={solid} />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle menu"
              className={solid ? "text-charcoal" : "text-shell"}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
                {open ? (
                  <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                ) : (
                  <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {open && (
        <div className="lg:hidden bg-sand border-t border-charcoal/10">
          <Container>
            <nav className="flex flex-col divide-y divide-charcoal/10">
              {[...leftLinks, ...rightLinks].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-4 text-sm font-bold uppercase tracking-[0.14em] text-charcoal"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                href="#contact"
                onClick={() => setOpen(false)}
                className="py-5 text-sm font-bold uppercase tracking-[0.14em] text-terracotta"
              >
                {dict.nav.bookEvent} →
              </Link>
            </nav>
          </Container>
        </div>
      )}
    </header>
  );
}
