"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function HeroSection() {
  const { dict } = useLocale();

  return (
    <section id="top" className="relative flex h-[100svh] min-h-[640px] w-full items-center justify-center overflow-hidden">
      <Image
        src="/images/hero-seaside.jpg"
        alt="Pau leaning in to check a giant paella cooking on a seaside promenade, ocean and coastline in the background"
        fill
        priority
        sizes="100vw"
        className="animate-ken-burns object-cover object-[78%_center] lg:object-center"
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(20,17,13,0.35) 0%, rgba(20,17,13,0.12) 30%, rgba(20,17,13,0.25) 68%, rgba(20,17,13,0.55) 100%)",
        }}
        aria-hidden
      />

      <div className="relative z-10 flex translate-y-6 flex-col items-center px-6 text-center text-shell sm:translate-y-8 lg:translate-y-10">
        <h1>
          <Image
            src="/images/logo/pauella-wordmark-white-bold.png"
            alt="Pauella"
            width={873}
            height={187}
            priority
            className="h-[2.6rem] w-auto drop-shadow-[0_2px_10px_rgba(0,0,0,0.35)] sm:h-[4.2rem] md:h-[5.8rem] lg:h-[6.6rem]"
          />
        </h1>
        <p className="mt-4 text-[0.72rem] font-black uppercase tracking-[0.32em] text-shell sm:text-[0.82rem]">
          {dict.hero.tagline}
        </p>

        <span className="my-6 h-8 w-px bg-shell/50" aria-hidden />

        <Link
          href="#contact"
          className="inline-flex items-center gap-2 rounded-full border border-shell/80 px-7 py-3 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-shell hover:text-charcoal"
        >
          {dict.hero.bookEvent} <span aria-hidden>→</span>
        </Link>
      </div>

      <Link
        href="#concept"
        aria-label={dict.hero.seeExperience}
        className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2 text-shell/80 transition-colors hover:text-shell"
      >
        <span className="hidden text-[0.65rem] font-medium uppercase tracking-[0.2em] sm:block">
          {dict.hero.seeExperience}
        </span>
        <span className="flex h-10 w-6 items-start justify-center rounded-full border border-shell/60 pt-2">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-shell/80" />
        </span>
      </Link>
    </section>
  );
}
