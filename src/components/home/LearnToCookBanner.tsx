"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useReveal } from "@/lib/useReveal";
import LearnToCookModal from "./LearnToCookModal";

// Compact teaser card closing the Extras section: the full detail (steps,
// kit, video) lives in the modal, so the page only carries title + one
// line + CTA.
export default function LearnToCookBanner() {
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
    <div
      id="learn"
      ref={ref}
      className={`relative mt-16 scroll-mt-28 overflow-hidden rounded-sm bg-sand transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 sm:mt-20 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
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
        <div className="absolute inset-0 bg-gradient-to-t from-sand via-sand/0 via-35% lg:bg-gradient-to-r lg:via-sand/60 lg:via-20% lg:to-transparent lg:to-60%" />
      </div>

      <div className="relative max-w-md px-6 pb-10 pt-2 sm:px-10 lg:px-14 lg:py-16">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
          {dict.learnToCook.eyebrow}
        </p>
        <h3 className="mt-4 text-balance text-3xl sm:text-4xl">{teaser.title}</h3>
        <p className="mt-4 text-charcoal-soft">{teaser.body}</p>

        <button
          type="button"
          onClick={openModal}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-terracotta-deep"
        >
          {teaser.cta}
          <span aria-hidden>→</span>
        </button>
      </div>

      <LearnToCookModal ref={dialogRef} open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  );
}
