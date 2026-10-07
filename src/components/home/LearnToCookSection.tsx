"use client";

import Link from "next/link";
import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useReveal } from "@/lib/useReveal";
import { PanGlyph, FlameGlyph, SpoonGlyph, GrainGlyph, PeopleGlyph, RecipeGlyph } from "./gallery-icons";

// One icon per kit item, same order as dict.learnToCook.kit.
const kitIcons = [PanGlyph, FlameGlyph, SpoonGlyph, GrainGlyph, PeopleGlyph, RecipeGlyph];

export default function LearnToCookSection() {
  const { dict } = useLocale();
  const { ref: stepsRef, visible: stepsVisible } = useReveal<HTMLDivElement>();
  const { ref: mediaRef, visible: mediaVisible } = useReveal<HTMLDivElement>();

  return (
    <section id="learn" className="bg-sand-deep py-28 sm:py-36">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            {dict.learnToCook.eyebrow}
          </p>
          <h2 className="mt-6 text-balance text-4xl sm:text-5xl">{dict.learnToCook.title}</h2>
          <p className="mt-6 text-balance text-charcoal-soft">{dict.learnToCook.body}</p>
        </div>

        <div
          ref={stepsRef}
          className="mt-14 flex flex-wrap items-center justify-center gap-x-2 gap-y-3 text-center"
        >
          {dict.learnToCook.steps.map((step, index) => (
            <div
              key={step}
              style={{ transitionDelay: `${index * 150}ms` }}
              className={`flex items-center gap-2 transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
                stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              }`}
            >
              <span className="flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-charcoal-soft">
                <span className="text-terracotta">0{index + 1}</span>
                {step}
              </span>
              {index < dict.learnToCook.steps.length - 1 && (
                <span className="text-charcoal-soft/50" aria-hidden>
                  →
                </span>
              )}
            </div>
          ))}
        </div>

        <div
          ref={mediaRef}
          className={`mt-16 grid items-center gap-12 lg:grid-cols-2 lg:gap-16 transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
            mediaVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm">
            <video
              autoPlay
              muted
              loop
              playsInline
              poster="/images/pau-showcooking-poster.jpg"
              className="h-full w-full object-cover"
            >
              <source src="/videos/pau-showcooking.mp4" type="video/mp4" />
            </video>
          </div>

          <div>
            <h3 className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
              {dict.learnToCook.kitTitle}
            </h3>
            <ul className="mt-6 space-y-4">
              {dict.learnToCook.kit.map((item, index) => {
                const Icon = kitIcons[index];
                return (
                  <li key={item} className="flex items-center gap-3 font-medium text-charcoal">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center text-terracotta [&>svg]:h-5 [&>svg]:w-5">
                      <Icon />
                    </span>
                    {item}
                  </li>
                );
              })}
            </ul>

            <Link
              href="#contact"
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-terracotta-deep"
            >
              {dict.learnToCook.cta}
              <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
