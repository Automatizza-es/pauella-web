"use client";

import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";
import { en } from "@/lib/i18n/en";

// Structured data always describes the canonical (English) page content.
const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: en.faq.items.map((faq) => ({
    "@type": "Question",
    name: faq.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: faq.answer,
    },
  })),
};

export default function FAQSection() {
  const { dict } = useLocale();

  return (
    <section id="faq" className="bg-sand py-28 sm:py-36">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <Container className="max-w-3xl">
        <div className="text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            {dict.faq.eyebrow}
          </p>
          <h2 className="mt-6 text-4xl sm:text-5xl">{dict.faq.title}</h2>
        </div>

        <div className="mt-14 divide-y divide-charcoal/10 border-t border-charcoal/10">
          {dict.faq.items.map((faq) => (
            <details key={faq.question} className="group py-6">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-left text-lg sm:text-xl">
                {faq.question}
                <span
                  aria-hidden
                  className="shrink-0 text-2xl font-light text-terracotta transition-transform group-open:rotate-45"
                >
                  +
                </span>
              </summary>
              <p className="mt-4 max-w-2xl text-charcoal-soft">{faq.answer}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
