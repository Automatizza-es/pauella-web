"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useReveal } from "@/lib/useReveal";
import { PaellaRow, type PaellaMedia } from "@/components/home/PaellaRow";
import { OliveBranchIllustration } from "@/components/home/decorative-icons";
import CustomIdeaModal from "./CustomIdeaModal";

// 01 — The Classics. Matches the order of dict.paellas.items.
const paellaMedia: PaellaMedia[] = [
  {
    src: "/images/paellas/not-paella-poster.jpg",
    alt: "Paella with chicken and mushrooms, shot from above",
    width: 960,
    height: 1278,
    video: "/videos/not-paella.mp4",
  },
  {
    src: "/images/paellas/original-poster.jpg",
    alt: "Traditional Valencian paella with chicken, green beans and rosemary",
    width: 960,
    height: 1032,
    video: "/videos/original.mp4",
  },
  {
    src: "/images/paellas/senorito-poster.jpg",
    alt: "Shell-free shrimp paella, close up, steam rising from the pan",
    width: 1200,
    height: 633,
    video: "/videos/senorito.mp4",
  },
];

// 02 — Signature Paellas. Matches the order of dict.specials.items.
const specialsMedia: PaellaMedia[] = [
  {
    src: "/images/paellas/lobster-poster.jpg",
    alt: "Paella with whole lobster at the center of the pan",
    width: 1000,
    height: 1250,
    video: "/videos/lobster.mp4",
  },
  {
    src: "/images/paellas/tomahawk-poster.jpg",
    alt: "Grilled tomahawk steak sliced over a paella pan with mushrooms and eggplant",
    width: 1100,
    height: 1005,
    video: "/videos/tomahawk.mp4",
  },
];

// Shared "running head" for each of the menu's 3 subsections. The number
// and dash anchor it to the chapter (same device repeated 3 times), while
// the oversized serif name gives each subsection its own editorial weight.
// `description` is optional — the two dish-listing subsections get a second,
// more evocative column; the closing "Custom Paella" subsection stays lean
// since its own big headline right below already carries that weight.
function SubsectionHeading({
  number,
  name,
  description,
}: {
  number: string;
  name: string;
  description?: string;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();

  return (
    <div
      ref={ref}
      className={`grid gap-8 transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 lg:grid-cols-[2fr_1fr] lg:items-start lg:gap-16 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium uppercase tracking-[0.2em] text-terracotta">
          {number}
        </span>
        <span className="h-px w-8 bg-terracotta/40" aria-hidden />
        <h3 className="text-5xl sm:text-6xl lg:text-7xl">{name}</h3>
      </div>
      {description && (
        <div className="border-t border-charcoal/15 pt-6 lg:border-l lg:border-t-0 lg:pl-10 lg:pt-0">
          <p className="text-charcoal-soft">{description}</p>
        </div>
      )}
    </div>
  );
}

export default function MenuSection() {
  const { dict } = useLocale();
  const { ref: introRef, visible: introVisible } = useReveal<HTMLDivElement>();
  const { ref: stepRef, visible: stepVisible } = useReveal<HTMLDivElement>();
  const dialogRef = useRef<HTMLDialogElement>(null);
  // Tracked by index, not label, so picks survive the EN/ES switch.
  const [selectedTags, setSelectedTags] = useState<number[]>([]);

  function toggleTag(index: number) {
    setSelectedTags((current) =>
      current.includes(index) ? current.filter((i) => i !== index) : [...current, index],
    );
  }

  return (
    <section id="menu" className="bg-sand-deep py-28 sm:py-36">
      <Container>
        {/* Chapter intro */}
        <div
          ref={introRef}
          className={`mx-auto max-w-2xl text-center transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
            introVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            {dict.menu.eyebrow}
          </p>
          <span className="mx-auto mt-3 block h-px w-6 bg-terracotta/40" aria-hidden />
          <h2 className="mt-6 text-5xl sm:text-6xl">{dict.menu.title}</h2>
          <p className="mt-6 text-balance text-charcoal-soft">{dict.menu.intro}</p>
        </div>

        {/* 01 — The Classics */}
        <div className="mt-24 border-t border-charcoal/10 pt-16 sm:mt-28 sm:pt-20">
          <div className="relative">
            <SubsectionHeading
              number="01"
              name={dict.paellas.name}
              description={dict.paellas.description}
            />
            <OliveBranchIllustration className="pointer-events-none absolute -bottom-10 right-0 hidden h-40 w-56 text-charcoal/10 lg:block" />
          </div>
          <div className="mt-4 divide-y divide-charcoal/10">
            {dict.paellas.items.map((paella, index) => (
              <PaellaRow
                key={paella.name}
                paella={paella}
                media={paellaMedia[index]}
                reversed={index % 2 === 1}
                ctaLabel={dict.paellas.cta}
                watchLabel={dict.paellas.watchLabel}
                blackLabel={dict.paellas.blackLabel}
                blackActiveLabel={dict.paellas.blackActiveLabel}
              />
            ))}
          </div>
        </div>

        {/* 02 — Signature Paellas */}
        <div className="mt-20 border-t border-charcoal/10 pt-16 sm:pt-20">
          <SubsectionHeading
            number="02"
            name={dict.specials.name}
            description={dict.specials.description}
          />
          <div className="mt-10 rounded-sm bg-charcoal-soft px-6 py-4 text-shell sm:px-10 sm:py-6 lg:px-14">
            <div className="divide-y divide-shell/10">
              {dict.specials.items.map((paella, index) => (
                <PaellaRow
                  key={paella.name}
                  paella={paella}
                  media={specialsMedia[index]}
                  reversed={index % 2 === 1}
                  ctaLabel={dict.specials.cta}
                  watchLabel={dict.specials.watchLabel}
                  dark
                />
              ))}
            </div>
          </div>
        </div>

        {/* 03 — Custom Paella */}
        <div className="mt-20 border-t border-charcoal/10 pt-16 sm:pt-20">
          <SubsectionHeading
            number="03"
            name={dict.customIdea.name}
            description={dict.customIdea.description}
          />

          {/* Compact banner, same treatment as the Learn To Cook teaser:
              the photo fades into the background from the
              text side, so the block reads as one strip, not a full row. */}
          <div
            ref={stepRef}
            className={`relative mt-10 overflow-hidden rounded-sm bg-sand transition-all lg:flex lg:min-h-[28rem] lg:items-center duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
              stepVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            }`}
          >
            <div className="relative aspect-[5/4] w-full sm:aspect-[4/3] lg:absolute lg:inset-y-0 lg:right-0 lg:aspect-auto lg:w-[48%]">
              <Image
                src="/images/paellas/custom-paella.jpg"
                alt="Pau smiling as he stirs a large paella pan by the pool at a private party"
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[50%_20%] lg:object-[50%_40%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-sand via-sand/0 via-20% lg:bg-gradient-to-r lg:via-sand/50 lg:via-15% lg:to-transparent lg:to-45%" />
            </div>

            <div className="relative max-w-lg px-6 pb-10 pt-2 sm:px-10 lg:px-14 lg:py-16">
              <span className="block h-px w-8 bg-terracotta" aria-hidden />
              <h3 className="mt-4 text-balance text-3xl sm:text-4xl">{dict.customIdea.title}</h3>
              <p className="mt-4 text-charcoal-soft">{dict.customIdea.body}</p>

              {/* One row from tablet up; on narrow phones four chips don't fit, so they wrap. */}
              <div className="mt-6 flex flex-wrap gap-2 sm:flex-nowrap">
                {dict.customIdea.tags.map((tag, index) => {
                  const active = selectedTags.includes(index);
                  return (
                    <button
                      key={tag}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleTag(index)}
                      className={`whitespace-nowrap rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] transition-colors ${
                        active
                          ? "border-terracotta bg-terracotta/10 text-terracotta"
                          : "border-charcoal/15 text-charcoal-soft hover:border-charcoal/30"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => dialogRef.current?.showModal()}
                className="mt-8 inline-flex whitespace-nowrap items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-terracotta-deep"
              >
                {dict.customIdea.cta}
                <span aria-hidden>→</span>
              </button>
            </div>
          </div>
        </div>
      </Container>

      <CustomIdeaModal
        ref={dialogRef}
        selectedTags={selectedTags.map((index) => dict.customIdea.tags[index])}
      />
    </section>
  );
}
