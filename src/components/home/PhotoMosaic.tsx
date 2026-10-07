import type { ReactElement } from "react";
import Image from "next/image";
import { FlameGlyph, OliveBranchGlyph } from "./gallery-icons";

const tileBase =
  "group relative aspect-square overflow-hidden rounded-sm transition-transform duration-500 ease-out hover:z-10 hover:scale-105 lg:aspect-auto";

function PhotoTile({ src, alt, span }: { src: string; alt: string; span: string }) {
  return (
    <div className={`${tileBase} ${span}`}>
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 30vw, 50vw"
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
      />
    </div>
  );
}

function BlockTile({
  tone,
  iconColor,
  Icon,
  span,
}: {
  tone: string;
  iconColor: string;
  Icon?: () => ReactElement;
  span: string;
}) {
  return (
    <div className={`${tileBase} ${span} flex items-center justify-center ${tone}`}>
      {Icon && <span className={iconColor}><Icon /></span>}
    </div>
  );
}

// The real-events bento mosaic, its own component so new rows of photos can
// be dropped in without touching the section that lays out the text column.
export default function PhotoMosaic() {
  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:grid-flow-dense lg:auto-rows-[11rem] lg:gap-4">
      <PhotoTile
        src="/images/gallery/pool-party.jpg"
        alt="Guests gathered around the pool as Pau serves paella at a Los Angeles event"
        span="lg:col-span-2 lg:row-span-2"
      />
      <BlockTile tone="bg-terracotta" iconColor="text-shell" Icon={FlameGlyph} span="" />
      <PhotoTile
        src="/images/gallery/close-up.jpg"
        alt="Pau leaning in to check the paella as it finishes cooking"
        span="lg:row-span-2"
      />
      <BlockTile tone="bg-olive-soft" iconColor="text-shell" span="" />
      <PhotoTile
        src="/images/gallery/table.jpg"
        alt="Friends gathered around a table of paella at a backyard Pauella event"
        span="lg:col-span-2 lg:row-span-2"
      />
      <BlockTile tone="bg-charcoal" iconColor="text-shell" Icon={OliveBranchGlyph} span="" />
      <BlockTile tone="bg-sand-deep" iconColor="text-charcoal" span="" />
      <PhotoTile
        src="/images/gallery/celebration.jpg"
        alt="Pau and friends celebrating around a paella pan at a Los Angeles pool party"
        span="col-span-2 lg:col-span-2"
      />
    </div>
  );
}
