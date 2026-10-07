"use client";

import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function ServiceAreaSection() {
  const { dict } = useLocale();

  return (
    <section id="service-area" className="bg-sand-deep py-24 sm:py-32">
      <Container className="max-w-3xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
          {dict.serviceArea.eyebrow}
        </p>
        <h2 className="mt-6 text-4xl sm:text-5xl">{dict.serviceArea.title}</h2>
        <p className="mx-auto mt-6 max-w-xl text-charcoal-soft">{dict.serviceArea.body}</p>
      </Container>
    </section>
  );
}
