"use client";

import { useState } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";
import PhotoMosaic from "./PhotoMosaic";

export default function PhotoVideoSection() {
  const { dict } = useLocale();
  const [openPoints, setOpenPoints] = useState<Set<number>>(new Set());

  function togglePoint(index: number) {
    setOpenPoints((current) => {
      const next = new Set(current);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }

  return (
    <section id="photo-video" className="bg-sand py-28 sm:py-36">
      <Container>
        <div className="grid gap-16 lg:grid-cols-[1.6fr_1fr] lg:gap-20">
          <PhotoMosaic />

          <div className="flex flex-col">
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
              {dict.photoVideo.eyebrow}
            </p>
            <h2 className="mt-6 text-5xl sm:text-6xl">{dict.photoVideo.title}</h2>
            <p className="mt-6 max-w-sm text-charcoal-soft">{dict.photoVideo.body}</p>

            <div className="mt-8 divide-y divide-charcoal/10 border-t border-charcoal/10">
              {dict.photoVideo.points.map((point, index) => {
                const open = openPoints.has(index);
                return (
                  <div key={point.name}>
                    <button
                      type="button"
                      onClick={() => togglePoint(index)}
                      aria-expanded={open}
                      className="flex w-full items-center justify-between gap-4 py-5 text-left"
                    >
                      <h3
                        className={`text-lg transition-colors duration-300 ${
                          open ? "text-terracotta" : "text-charcoal"
                        }`}
                      >
                        {point.name}
                      </h3>
                      <span
                        className={`text-xl text-charcoal-soft transition-transform duration-300 ${
                          open ? "rotate-45" : ""
                        }`}
                        aria-hidden
                      >
                        +
                      </span>
                    </button>
                    <div
                      className={`grid transition-all duration-300 ease-out ${
                        open ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <p className="overflow-hidden pb-5 text-sm text-charcoal-soft">
                        {point.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            <Link
              href="#contact"
              className="mt-10 inline-flex items-center gap-2 self-start text-xs font-medium uppercase tracking-[0.2em] text-charcoal underline decoration-charcoal/30 underline-offset-8 transition-colors hover:text-terracotta hover:decoration-terracotta"
            >
              {dict.photoVideo.cta} <span aria-hidden>→</span>
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
