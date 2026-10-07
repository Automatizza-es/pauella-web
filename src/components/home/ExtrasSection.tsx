"use client";

import { useState } from "react";
import Image from "next/image";
import Container from "@/components/layout/Container";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useReveal } from "@/lib/useReveal";

// Real photos for the first 3 tiles (Jamón, Small Bites, Staff). "Something
// Special" has no photo yet and keeps the gradient placeholder.
const photos = ["/images/extras/jamon.jpg", "/images/extras/small-bites.jpg", "/images/extras/staff.jpg"];

// Placeholder tone used only for tiles without a real photo yet.
const tones = [
  "from-terracotta-deep via-charcoal-soft to-charcoal",
  "from-olive-soft via-charcoal-soft to-charcoal",
  "from-charcoal-soft via-charcoal to-terracotta-deep",
  "from-charcoal via-charcoal-soft to-olive-soft",
];

function ExtraTile({
  item,
  photo,
  tone,
  index,
}: {
  item: { name: string; points: string[] };
  photo?: string;
  tone: string;
  index: number;
}) {
  const [open, setOpen] = useState(false);
  const { ref, visible } = useReveal<HTMLButtonElement>();

  return (
    <button
      ref={ref}
      type="button"
      onClick={() => setOpen((v) => !v)}
      aria-expanded={open}
      style={{ transitionDelay: `${index * 150}ms` }}
      className={`group relative aspect-[4/5] overflow-hidden rounded-sm text-left transition-all duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
        photo ? "" : `bg-gradient-to-br ${tone}`
      } ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
    >
      {photo ? (
        <Image
          src={photo}
          alt={item.name}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      ) : (
        <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105" />
      )}
      {photo && (
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-charcoal/10 to-transparent" aria-hidden />
      )}

      <div
        className={`absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-500 ${
          open ? "opacity-0" : "opacity-100 group-hover:opacity-0"
        }`}
      >
        <h3 className="font-serif text-2xl text-shell sm:text-3xl">{item.name}</h3>
      </div>

      <div
        className={`absolute inset-0 flex flex-col justify-end bg-charcoal/60 p-6 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      >
        <h3 className="font-serif text-2xl text-shell sm:text-3xl">{item.name}</h3>
        <ul className="mt-3 space-y-1 text-sm text-shell/90">
          {item.points.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      </div>
    </button>
  );
}

export default function ExtrasSection() {
  const { dict } = useLocale();

  return (
    <section id="extras" className="bg-shell py-28 sm:py-36">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">
            {dict.extras.eyebrow}
          </p>
          <h2 className="mt-6 text-5xl sm:text-6xl">{dict.extras.title}</h2>
          <p className="mt-6 text-balance text-charcoal-soft">{dict.extras.subtitle}</p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
          {dict.extras.items.map((item, index) => (
            <ExtraTile key={item.name} item={item} photo={photos[index]} tone={tones[index]} index={index} />
          ))}
        </div>
      </Container>
    </section>
  );
}
