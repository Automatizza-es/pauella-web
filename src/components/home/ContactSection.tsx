"use client";

import Container from "@/components/layout/Container";
import ContactForm from "./ContactForm";
import { siteConfig } from "@/lib/site-config";
import { useLocale } from "@/components/providers/LocaleProvider";

export default function ContactSection() {
  const { dict } = useLocale();

  return (
    <section id="contact" className="bg-charcoal py-28 text-shell sm:py-36">
      <Container className="grid gap-16 lg:grid-cols-[1fr_1.2fr] lg:gap-24">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            {dict.contact.eyebrow}
          </p>
          <h2 className="mt-6 text-balance text-4xl sm:text-5xl">{dict.contact.title}</h2>
          <p className="mt-6 max-w-sm text-shell/75">{dict.contact.body}</p>

          <div className="mt-10 space-y-2 text-sm text-shell/80">
            <p>
              <a href={`tel:${siteConfig.phoneHref}`} className="hover:text-terracotta">
                {siteConfig.phone}
              </a>
            </p>
            <p>
              <a href={`mailto:${siteConfig.email}`} className="hover:text-terracotta">
                {siteConfig.email}
              </a>
            </p>
            <p>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-terracotta"
              >
                {siteConfig.instagramHandle}
              </a>
            </p>
          </div>
        </div>

        <ContactForm />
      </Container>
    </section>
  );
}
