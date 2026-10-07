"use client";

import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function ConceptSection() {
  const { dict } = useLocale();

  return (
    <section id="concept" className="bg-sand py-28 sm:py-36">
      <Container className="max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
          {dict.concept.eyebrow}
        </p>
        <h2 className="mt-6 text-balance text-4xl sm:text-5xl md:text-6xl">{dict.concept.title}</h2>
        <p className="mx-auto mt-8 max-w-xl text-balance text-base sm:text-lg text-charcoal-soft">
          {dict.concept.body}
        </p>
      </Container>
    </section>
  );
}
