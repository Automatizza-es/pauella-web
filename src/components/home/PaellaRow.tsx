"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useReveal } from "@/lib/useReveal";
import { paellaSlug, toggleInterestedPaella } from "@/lib/useInterestedPaella";

export type PaellaMedia = {
  src: string;
  alt: string;
  width: number;
  height: number;
  video?: string;
};

export function PaellaRow({
  paella,
  media,
  reversed,
  ctaLabel,
  watchLabel,
  touchWatchLabel,
  blackLabel,
  blackActiveLabel,
  dark = false,
}: {
  paella: { name: string; description: string; blackOption?: string };
  media: PaellaMedia;
  reversed: boolean;
  ctaLabel: string;
  watchLabel: string;
  touchWatchLabel: string;
  blackLabel?: string;
  blackActiveLabel?: string;
  dark?: boolean;
}) {
  const { ref, visible } = useReveal<HTMLDivElement>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [isBlack, setIsBlack] = useState(false);

  function start() {
    if (!media.video) return;
    setPlaying(true);
    videoRef.current?.play().catch(() => {});
  }

  function stop() {
    if (!media.video) return;
    setPlaying(false);
    const video = videoRef.current;
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  }

  // The tile is capped at a max height of 24rem (384px) on desktop; derive
  // the matching width from the photo's real aspect ratio so any shape
  // (portrait or panoramic) carries the same visual weight. Setting this
  // directly (instead of leaning on CSS `w-auto`/`h-auto` + a `w-fit`
  // parent) avoids a real layout-shift bug: that combination left the tile
  // at 0×0 until the image resource itself loaded, which also threw off
  // every anchor-link scroll on the page by however much the layout grew
  // mid-scroll.
  const maxTileWidth = Math.round(384 * (media.width / media.height));

  return (
    <div
      ref={ref}
      id={paellaSlug(paella.name)}
      className={`grid scroll-mt-28 items-center gap-7 py-9 transition-all duration-1000 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 lg:grid-cols-[2fr_3fr] lg:gap-16 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
    >
      <div
        onPointerEnter={(event) => {
          if (event.pointerType === "mouse") start();
        }}
        onPointerLeave={(event) => {
          if (event.pointerType === "mouse") stop();
        }}
        onClick={() => (playing ? stop() : start())}
        style={
          {
            aspectRatio: `${media.width} / ${media.height}`,
            "--tile-max-w": `${maxTileWidth}px`,
          } as React.CSSProperties
        }
        className={`relative w-full overflow-hidden lg:max-w-[var(--tile-max-w)] lg:justify-self-center ${media.video ? "cursor-pointer" : ""} ${
          reversed ? "lg:order-2" : ""
        }`}
      >
        <Image
          src={media.src}
          alt={media.alt}
          width={media.width}
          height={media.height}
          sizes="(min-width: 1024px) 45vw, 100vw"
          className={`block h-full w-full ${
            media.video
              ? `transition-opacity duration-500 ${playing ? "opacity-0" : "opacity-100 animate-paella-breathe"}`
              : ""
          }`}
        />
        {media.video && (
          <>
            <video
              ref={videoRef}
              muted
              loop
              playsInline
              preload="metadata"
              className={`absolute inset-0 h-full w-full object-contain transition-opacity duration-500 ${
                playing ? "opacity-100" : "opacity-0"
              }`}
            >
              <source src={media.video} type="video/mp4" />
            </video>
            <span
              className={`pointer-events-none absolute bottom-4 left-4 right-4 flex items-center gap-2 text-[0.65rem] font-medium uppercase tracking-[0.18em] text-shell transition-opacity duration-300 [text-shadow:0_1px_4px_rgba(0,0,0,0.45)] ${
                playing ? "opacity-0" : "opacity-100"
              }`}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-soft-pulse rounded-full bg-shell" />
              </span>
              <span className="hidden [@media(hover:hover)_and_(pointer:fine)]:inline">{watchLabel}</span>
              <span className="[@media(hover:hover)_and_(pointer:fine)]:hidden">{touchWatchLabel}</span>
              <span aria-hidden>↗</span>
            </span>
          </>
        )}
      </div>
      <div className={reversed ? "lg:order-1 lg:text-right" : ""}>
        <span
          className={`block h-px w-8 bg-terracotta ${reversed ? "lg:ml-auto" : ""}`}
          aria-hidden
        />
        <h3 className="mt-4 text-3xl sm:text-4xl">{paella.name}</h3>
        <p
          className={`mt-6 max-w-md ${dark ? "text-shell/70" : "text-charcoal-soft"} ${reversed ? "lg:ml-auto" : ""}`}
        >
          {paella.description}
        </p>
        {paella.blackOption && blackLabel && blackActiveLabel && (
          <div className={`mt-5 ${reversed ? "lg:flex lg:flex-col lg:items-end" : ""}`}>
            <button
              type="button"
              onClick={() => setIsBlack((v) => !v)}
              aria-pressed={isBlack}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] transition-colors duration-[350ms] ${
                isBlack
                  ? dark
                    ? "border-shell bg-shell text-charcoal"
                    : "border-charcoal bg-charcoal text-shell"
                  : dark
                    ? "border-shell/30 text-shell hover:border-shell/60"
                    : "border-charcoal/20 text-charcoal hover:border-charcoal/40"
              }`}
            >
              {isBlack ? (
                <>
                  <span
                    className={`h-2 w-2 rounded-full ${dark ? "bg-charcoal" : "bg-shell"}`}
                    aria-hidden
                  />
                  {blackActiveLabel}
                </>
              ) : (
                <>
                  {blackLabel}
                  <span
                    className={`h-2 w-2 rounded-full ${dark ? "bg-shell" : "bg-charcoal"}`}
                    aria-hidden
                  />
                </>
              )}
            </button>
            {isBlack && (
              <p className={`mt-2 text-xs ${dark ? "text-shell/60" : "text-charcoal-soft"}`}>
                {paella.blackOption}
              </p>
            )}
          </div>
        )}
        <Link
          href="#contact"
          onClick={() => toggleInterestedPaella(paella.name)}
          className={`mt-6 inline-block text-xs font-medium uppercase tracking-[0.2em] transition-colors ${
            dark
              ? "text-shell underline decoration-shell/40 underline-offset-8 hover:text-terracotta hover:decoration-terracotta"
              : "text-charcoal underline decoration-charcoal/30 underline-offset-8 hover:text-terracotta hover:decoration-terracotta"
          }`}
        >
          {ctaLabel}
        </Link>
      </div>
    </div>
  );
}
