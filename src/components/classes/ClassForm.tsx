"use client";
import { useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";
import { useLanguageDraft } from "@/lib/language-drafts";
import { classContent } from "@/lib/classes/content";

const subscribeHydration = () => () => {};
const hydratedSnapshot = () => true;
const serverSnapshot = () => false;

const inputClass = "w-full border-0 border-b border-shell/25 bg-transparent py-2.5 text-shell focus:border-terracotta focus:outline-none [color-scheme:dark]";
function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="block"><span className="mb-2 block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-shell/70">{label}</span>{children}</label>;
}
export default function ClassForm() {
  const { locale } = useLocale();
  const copy = classContent[locale].form;
  const draftRef = useLanguageDraft("cooking-class");
  const hydrated = useSyncExternalStore(subscribeHydration, hydratedSnapshot, serverSnapshot);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setStatus("submitting");
    try {
      const response = await fetch("/api/cooking-class", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), serviceId: "cooking-class" }),
      });
      if (!response.ok) throw new Error("Request failed");
      form.reset();
      setStatus("success");
    } catch { setStatus("error"); }
  }
  if (status === "success") return <p role="status" className="text-lg text-shell">{copy.success}</p>;
  return <form action="/api/cooking-class" method="post" ref={draftRef} data-draft="cooking-class" data-submitting={status === "submitting"} onSubmit={submit} aria-busy={status === "submitting"} className="grid gap-7 sm:grid-cols-2">
    <noscript><p className="text-sm text-shell sm:col-span-2">{locale === "en" ? "Enable JavaScript to use this form, or contact Pau by email using the link beside it." : "Activa JavaScript para utilizar este formulario o escribe a Pau con el enlace de email que aparece junto a él."}</p></noscript>
    <Field label={copy.name}><input name="name" required maxLength={120} autoComplete="name" className={inputClass} /></Field>
    <Field label={copy.email}><input name="email" type="email" required maxLength={254} autoComplete="email" className={inputClass} /></Field>
    <Field label={copy.participants}><input name="participants" type="number" required min={1} step={1} inputMode="numeric" className={inputClass} /></Field>
    <Field label={copy.date}><input name="preferredDate" type="date" className={inputClass} /></Field>
    <div className="sm:col-span-2"><Field label={copy.location}><input name="location" maxLength={300} autoComplete="off" className={inputClass} /></Field></div>
    <div className="sm:col-span-2"><Field label={copy.message}><textarea name="message" maxLength={4000} rows={4} className={`${inputClass} resize-none`} /></Field></div>
    <button type="submit" disabled={!hydrated || status === "submitting"} className="inline-flex items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-terracotta-deep disabled:opacity-60 sm:col-span-2 sm:w-fit">
      {status === "submitting" ? copy.sending : copy.submit}<span aria-hidden>→</span>
    </button>
    {status === "error" && <p role="alert" className="text-sm text-shell sm:col-span-2">{copy.error}</p>}
  </form>;
}
