"use client";

import { useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import Link from "next/link";
import { useLocale } from "@/components/providers/LocaleProvider";
import {
  COOKING_CLASS,
  clearInterestedPaella,
  paellaSlug,
  removeInterestedPaella,
  useInterestedPaella,
} from "@/lib/useInterestedPaella";

type Status = "idle" | "submitting" | "success" | "error";

// Half-hour slots from 8:00 to 23:30. A select rather than <input
// type="time">, since mobile time wheels ignore `step` and would let
// someone pick 19:15 and then fail validation on submit.
const timeSlots = Array.from({ length: 32 }, (_, i) => {
  const minutes = 8 * 60 + i * 30;
  return `${String(Math.floor(minutes / 60)).padStart(2, "0")}:${String(minutes % 60).padStart(2, "0")}`;
});

// Values stay 24h ("19:30") for the email; English visitors (LA) see 12h.
function formatSlot(slot: string, locale: string) {
  if (locale !== "en") return slot;
  const [h, m] = slot.split(":").map(Number);
  return `${h % 12 || 12}:${String(m).padStart(2, "0")} ${h < 12 ? "AM" : "PM"}`;
}

const inputClass =
  "w-full border-0 border-b border-shell/25 bg-transparent py-2.5 text-shell placeholder:text-shell/30 focus:border-terracotta focus:outline-none [color-scheme:dark]";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-shell/45">
        {label}
      </span>
      {children}
    </label>
  );
}

export default function ContactForm() {
  const { dict, locale } = useLocale();
  const form = dict.contact.form;
  const [status, setStatus] = useState<Status>("idle");
  const interestedPaellas = useInterestedPaella();
  const labelFor = (name: string) => (name === COOKING_CLASS ? form.cookingClass : name);
  // "+ Add another paella" jumps back to the last dish row picked; the
  // cooking class has no row of its own, so it falls back to the menu.
  const lastDish = interestedPaellas.filter((name) => name !== COOKING_CLASS).at(-1);
  const nameInputRef = useRef<HTMLInputElement>(null);
  const hadAnyRef = useRef(false);

  // Clicking "Ask about this one" scrolls here, but a scroll alone is easy
  // to miss on a long page — focusing the first field gives a visible,
  // unmistakable signal that something happened, without fighting the
  // anchor's own smooth-scroll (preventScroll avoids a second scroll jump).
  // Only on the first dish added, though — re-focusing every time someone
  // adds a second or third pan would yank the cursor out of whatever
  // field they were already filling in.
  useEffect(() => {
    if (interestedPaellas.length > 0 && !hadAnyRef.current) {
      nameInputRef.current?.focus({ preventScroll: true });
    }
    hadAnyRef.current = interestedPaellas.length > 0;
  }, [interestedPaellas]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formEl = event.currentTarget;
    const data = Object.fromEntries(new FormData(formEl).entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      formEl.reset();
      clearInterestedPaella();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return <p className="text-lg text-shell">{form.success}</p>;
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-7 sm:grid-cols-2">
      {interestedPaellas.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 sm:col-span-2">
          <span className="text-xs text-shell/60">{form.askingAbout}:</span>
          {interestedPaellas.map((name) => (
            <span
              key={name}
              className="inline-flex items-center gap-2 rounded-full border border-terracotta/40 bg-terracotta/10 px-4 py-2 text-xs text-shell"
            >
              {labelFor(name)}
              <button
                type="button"
                onClick={() => removeInterestedPaella(name)}
                aria-label={`Remove ${labelFor(name)}`}
                className="text-shell/60 transition-colors hover:text-shell"
              >
                ×
              </button>
            </span>
          ))}
          <Link
            href={lastDish ? `#${paellaSlug(lastDish)}` : "#menu"}
            className="text-xs text-shell/60 underline decoration-shell/30 underline-offset-4 transition-colors hover:text-terracotta hover:decoration-terracotta"
          >
            {form.addAnother}
          </Link>
        </div>
      )}
      <input type="hidden" name="interestedPaella" value={interestedPaellas.map(labelFor).join(", ")} />
      <Field label={form.name}>
        <input ref={nameInputRef} name="name" required className={inputClass} />
      </Field>
      <Field label={form.email}>
        <input name="email" type="email" required className={inputClass} />
      </Field>
      <Field label={form.phone}>
        <input name="phone" type="tel" className={inputClass} />
      </Field>
      <Field label={form.eventLocation}>
        <input name="eventLocation" className={inputClass} />
      </Field>
      <Field label={form.eventDate}>
        <input name="eventDate" type="date" className={inputClass} />
      </Field>
      <Field label={form.eventTime}>
        <select name="eventTime" defaultValue="" className={`${inputClass} [&_option]:text-charcoal`}>
          <option value="">—</option>
          {timeSlots.map((slot) => (
            <option key={slot} value={slot}>
              {formatSlot(slot, locale)}
            </option>
          ))}
        </select>
      </Field>
      <Field label={form.guestCount}>
        <input name="guestCount" type="number" min={1} className={inputClass} />
      </Field>
      <Field label={form.eventType}>
        <select
          name="eventType"
          defaultValue=""
          className={`${inputClass} [&_option]:text-charcoal`}
        >
          <option value="" disabled>
            —
          </option>
          <option value="private-party">{form.eventTypeOptions.privateParty}</option>
          <option value="wedding">{form.eventTypeOptions.wedding}</option>
          <option value="corporate">{form.eventTypeOptions.corporate}</option>
          <option value="other">{form.eventTypeOptions.other}</option>
        </select>
      </Field>
      <div className="sm:col-span-2">
        <Field label={form.message}>
          <textarea name="message" rows={3} className={`${inputClass} resize-none`} />
        </Field>
      </div>

      <button
        type="submit"
        disabled={status === "submitting"}
        className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-terracotta-deep disabled:opacity-60 sm:col-span-2 sm:w-fit"
      >
        {status === "submitting" ? form.submitting : form.submit}
        <span aria-hidden>→</span>
      </button>

      {status === "error" && (
        <p className="text-sm text-terracotta sm:col-span-2">{form.error}</p>
      )}
    </form>
  );
}
