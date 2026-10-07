"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function AboutPauSection() {
  const { dict } = useLocale();

  return (
    <section id="about" className="relative overflow-hidden bg-charcoal py-28 text-shell sm:py-36">
      <Container className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div className="order-2 lg:order-1">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            {dict.about.eyebrow}
          </p>
          <h2 className="mt-6 text-4xl sm:text-5xl">{dict.about.title}</h2>
          <p className="mt-6 max-w-md text-shell/80">{dict.about.body}</p>
          <p className="mt-8 font-serif text-2xl italic text-shell sm:text-3xl">
            &ldquo;{dict.about.quote}&rdquo;
          </p>
        </div>

        <div className="order-1 aspect-[4/5] overflow-hidden rounded-sm lg:order-2">
          <Image
            src="/images/pau-sunset-paella.png"
            alt="Pau, the chef behind Pauella, cooking paella over an open fire"
            width={800}
            height={1000}
            className="h-full w-full object-cover object-[78%_35%]"
            loading="lazy"
          />
        </div>
      </Container>
    </section>
  );
}
