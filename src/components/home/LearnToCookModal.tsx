"use client";

import { forwardRef } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { COOKING_CLASS, addInterestedPaella } from "@/lib/useInterestedPaella";
import { PanGlyph, FlameGlyph, SpoonGlyph, GrainGlyph, PeopleGlyph, RecipeGlyph } from "./gallery-icons";

// One icon per kit item, same order as dict.learnToCook.kit.
const kitIcons = [PanGlyph, FlameGlyph, SpoonGlyph, GrainGlyph, PeopleGlyph, RecipeGlyph];

type Props = {
  // The video only mounts while the modal is open, so it isn't downloaded
  // for visitors who never click through from the teaser.
  open: boolean;
  onClose: () => void;
};

const LearnToCookModal = forwardRef<HTMLDialogElement, Props>(function LearnToCookModal(
  { open, onClose },
  ref,
) {
  const { dict } = useLocale();
  const learn = dict.learnToCook;

  function close() {
    if (ref && "current" in ref) ref.current?.close();
  }

  return (
    <dialog
      ref={ref}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onClose={onClose}
      className="m-auto max-h-[90vh] w-[min(56rem,calc(100vw-2.5rem))] overflow-y-auto rounded-sm bg-shell p-0 text-charcoal backdrop:bg-charcoal/50 backdrop:backdrop-blur-sm open:animate-modal-in"
    >
      <div className="relative p-8 sm:p-12">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-6 top-6 text-charcoal-soft/50 transition-colors hover:text-charcoal"
        >
          <span aria-hidden className="text-xl leading-none">
            ×
          </span>
        </button>

        <p className="text-xs font-medium uppercase tracking-[0.28em] text-terracotta">{learn.eyebrow}</p>
        <h3 className="mt-4 max-w-md text-balance text-3xl sm:text-4xl">{learn.title}</h3>
        <p className="mt-4 max-w-md text-charcoal-soft">{learn.body}</p>

        <ol className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-3">
          {learn.steps.map((step, index) => (
            <li key={step} className="flex items-center gap-2">
              <span className="flex items-center gap-2 rounded-full border border-charcoal/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.1em] text-charcoal-soft">
                <span className="text-terracotta">0{index + 1}</span>
                {step}
              </span>
              {index < learn.steps.length - 1 && (
                <span className="hidden text-charcoal-soft/50 sm:inline" aria-hidden>
                  →
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-10 grid items-center gap-10 sm:grid-cols-[minmax(0,16rem)_1fr]">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-64 overflow-hidden rounded-sm bg-sand-deep">
            {open && (
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
            )}
          </div>

          <div>
            <h4 className="font-sans text-xs font-medium uppercase tracking-[0.28em] text-terracotta">{learn.kitTitle}</h4>
            <ul className="mt-6 space-y-4">
              {learn.kit.map((item, index) => {
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

            <a
              href="#contact"
              onClick={() => {
                addInterestedPaella(COOKING_CLASS);
                close();
              }}
              className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-terracotta-deep"
            >
              {learn.cta}
              <span aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </dialog>
  );
});

export default LearnToCookModal;
