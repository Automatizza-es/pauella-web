"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useReveal } from "@/lib/useReveal";
import LearnToCookModal from "./LearnToCookModal";

// Compact teaser banner: the full detail (steps, kit, video) lives in the
// modal, so the main scroll only carries title + one line + CTA.
export default function LearnToCookSection() {
  const { dict } = useLocale();
  const teaser = dict.learnToCook.teaser;
  const { ref, visible } = useReveal<HTMLDivElement>();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [modalOpen, setModalOpen] = useState(false);

  function openModal() {
    setModalOpen(true);
    dialogRef.current?.showModal();
  }

  return (
    <section id="learn" className="relative overflow-hidden bg-shell">
      <div className="relative aspect-[16/10] w-full sm:aspect-[16/7] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[58%]">
        <Image
          src="/images/learn-rice-pour.jpg"
          alt=""
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover object-[50%_40%]"
        />
        {/* Fade the photo into the cream background: from below on mobile,
            from the text side on desktop. */}
        <div className="absolute inset-0 bg-gradient-to-t from-shell via-shell/0 via-35% lg:bg-gradient-to-r lg:via-shell/60 lg:via-20% lg:to-transparent lg:to-60%" />
      </div>

      <Container>
        <div
          ref={ref}
          className={`relative max-w-md pb-16 lg:max-w-sm pt-2 transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 lg:py-28 ${
            visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            {dict.learnToCook.eyebrow}
          </p>
          <h2 className="mt-5 text-balance text-4xl sm:text-5xl lg:text-6xl">{teaser.title}</h2>
          <p className="mt-5 text-charcoal-soft">{teaser.body}</p>

          <button
            type="button"
            onClick={openModal}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-terracotta-deep"
          >
            {teaser.cta}
            <span aria-hidden>→</span>
          </button>
        </div>
      </Container>

      <LearnToCookModal ref={dialogRef} open={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
}
