"use client";

import { useState } from "react";
import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useReveal } from "@/lib/useReveal";
import { experienceIcons } from "./experience-icons";

function IconCircle({
  Icon,
  highlighted,
  size,
}: {
  Icon: (typeof experienceIcons)[number];
  highlighted: boolean;
  size: "lg" | "sm";
}) {
  const dimensions = size === "lg" ? "h-16 w-16" : "h-14 w-14";
  return (
    <span
      className={`relative flex ${dimensions} shrink-0 items-center justify-center rounded-full transition-all duration-400 ease-out ${
        highlighted
          ? "scale-110 bg-terracotta text-shell shadow-[0_0_0_8px_rgba(193,89,47,0.12)]"
          : "scale-100 bg-shell text-charcoal ring-1 ring-charcoal/12"
      }`}
    >
      <Icon />
    </span>
  );
}

export default function ExperienceSection() {
  const { dict } = useLocale();
  const { ref, visible } = useReveal<HTMLDivElement>();
  const [active, setActive] = useState<number | null>(null);

  return (
    <section id="experience" className="bg-shell py-28 sm:py-36">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            {dict.experience.eyebrow}
          </p>
          <h2 className="mt-6 text-5xl sm:text-6xl">{dict.experience.title}</h2>
          <p className="mt-6 text-balance text-charcoal-soft">{dict.experience.subtitle}</p>
        </div>

        <div ref={ref} className="mt-20 sm:mt-24">
          {/* Desktop: horizontal roadmap */}
          <ol className="relative hidden lg:grid lg:grid-cols-5 lg:gap-x-6">
            <div className="absolute inset-x-[10%] top-8 h-px bg-charcoal/10" aria-hidden />
            <div
              className={`absolute inset-x-[10%] top-8 h-px origin-left scale-x-0 bg-terracotta transition-transform duration-[2400ms] ease-out delay-200 motion-reduce:transition-none ${
                visible ? "scale-x-100" : ""
              }`}
              aria-hidden
            />
            {dict.experience.steps.map((step, index) => {
              const Icon = experienceIcons[index];
              const highlighted = active === null ? index === 2 : active === index;
              return (
                <li
                  key={step.step}
                  onMouseEnter={() => setActive(index)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive((v) => (v === index ? null : index))}
                  className={`relative flex cursor-default flex-col items-center px-2 text-center transition-all duration-900 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                  style={{ transitionDelay: `${index * 220}ms` }}
                >
                  <IconCircle Icon={Icon} highlighted={highlighted} size="lg" />
                  <span
                    className={`mt-4 text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                      highlighted ? "text-terracotta" : "text-terracotta/50"
                    }`}
                  >
                    {step.step}
                  </span>
                  <h3 className="mt-2 text-xl">{step.title}</h3>
                  <p className="mt-2 max-w-[13rem] text-sm text-charcoal-soft">{step.description}</p>
                </li>
              );
            })}
          </ol>

          {/* Mobile: vertical roadmap */}
          <ol className="relative flex flex-col gap-10 lg:hidden">
            <div className="absolute left-7 top-7 bottom-7 w-px bg-charcoal/10" aria-hidden />
            <div
              className={`absolute left-7 top-7 bottom-7 w-px origin-top scale-y-0 bg-terracotta transition-transform duration-[2400ms] ease-out delay-200 motion-reduce:transition-none ${
                visible ? "scale-y-100" : ""
              }`}
              aria-hidden
            />
            {dict.experience.steps.map((step, index) => {
              const Icon = experienceIcons[index];
              const highlighted = active === null ? index === 2 : active === index;
              return (
                <li
                  key={step.step}
                  onClick={() => setActive((v) => (v === index ? null : index))}
                  className={`relative flex cursor-default gap-5 transition-all duration-900 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
                    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                  style={{ transitionDelay: `${index * 220}ms` }}
                >
                  <IconCircle Icon={Icon} highlighted={highlighted} size="sm" />
                  <div className="pt-1">
                    <span
                      className={`text-xs font-medium uppercase tracking-[0.18em] transition-colors duration-300 ${
                        highlighted ? "text-terracotta" : "text-terracotta/50"
                      }`}
                    >
                      {step.step}
                    </span>
                    <h3 className="mt-1 text-xl">{step.title}</h3>
                    <p className="mt-1 max-w-xs text-sm text-charcoal-soft">{step.description}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Container>
    </section>
  );
}
