"use client";
import { useState } from "react";
import Image from "next/image";

export default function ClassVideo({ label, alt, fallback }: { label: string; alt: string; fallback: string }) {
  const [open, setOpen] = useState(false);
  return <div className="relative mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden rounded-sm bg-sand-deep">
    {open ? <video controls autoPlay muted playsInline preload="none" poster="/images/pau-showcooking-poster.jpg" className="h-full w-full object-cover" aria-label={label}>
      <source src="/videos/pau-showcooking.mp4" type="video/mp4" />{fallback}
    </video> : <button type="button" onClick={() => setOpen(true)} className="group absolute inset-0 h-full w-full text-shell" aria-label={label}>
      <Image src="/images/pau-showcooking-poster.jpg" alt={alt} fill sizes="(min-width: 1024px) 384px, 90vw" className="object-cover" />
      <span className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" aria-hidden />
      <span className="absolute inset-x-6 bottom-8 rounded-full border border-shell/70 px-5 py-3 text-xs font-bold uppercase tracking-[0.16em] transition-colors group-hover:bg-shell group-hover:text-charcoal"><span aria-hidden>▷ </span>{label}</span>
    </button>}
  </div>;
}
