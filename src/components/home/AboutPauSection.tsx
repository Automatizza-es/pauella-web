"use client";

import Image from "next/image";
import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function AboutPauSection() {
  const { dict } = useLocale();

  return (
    <section id="about" className="relative overflow-hidden bg-charcoal py-20 text-shell sm:py-24">
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

        <div className="order-1 aspect-[4/3] overflow-hidden rounded-sm lg:order-2">
          <Image
            src="/images/about-pau.jpg"
            alt="Pau, the chef behind Pauella, smiling next to a steaming paella pan on the beach"
            width={1174}
            height={1583}
            className="h-full w-full object-cover object-[50%_30%]"
            loading="lazy"
          />
        </div>
      </Container>
    </section>
  );
}
