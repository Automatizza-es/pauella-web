"use client";

import { forwardRef, useState, type FormEvent, type ReactNode } from "react";
import { useLocale } from "@/components/providers/LocaleProvider";

type Status = "idle" | "submitting" | "success" | "error";

const inputClass =
  "w-full border-0 border-b border-charcoal/20 bg-transparent py-2.5 text-charcoal placeholder:text-charcoal-soft/40 focus:border-terracotta focus:outline-none";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[0.65rem] font-medium uppercase tracking-[0.18em] text-charcoal-soft/60">
        {label}
      </span>
      {children}
    </label>
  );
}

const CustomIdeaModal = forwardRef<HTMLDialogElement>(function CustomIdeaModal(_props, ref) {
  const { dict } = useLocale();
  const modal = dict.customIdea.modal;
  const [status, setStatus] = useState<Status>("idle");

  function close() {
    if (ref && "current" in ref) ref.current?.close();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const formEl = event.currentTarget;
    const data = Object.fromEntries(new FormData(formEl).entries());

    try {
      const response = await fetch("/api/custom-idea", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      formEl.reset();
    } catch {
      setStatus("error");
    }
  }

  return (
    <dialog
      ref={ref}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      onClose={() => setStatus("idle")}
      className="m-auto max-h-[90vh] w-[min(32rem,calc(100vw-2.5rem))] overflow-y-auto rounded-sm bg-shell p-0 text-charcoal backdrop:bg-charcoal/50 backdrop:backdrop-blur-sm open:animate-modal-in"
    >
      <div className="relative p-8 sm:p-10">
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

        {status === "success" ? (
          <p className="max-w-sm text-balance py-6 text-lg">{modal.success}</p>
        ) : (
          <>
            <h3 className="max-w-sm text-balance text-2xl sm:text-3xl">{modal.title}</h3>
            <p className="mt-3 max-w-sm text-sm text-charcoal-soft">{modal.body}</p>

            <form onSubmit={handleSubmit} className="mt-8 grid gap-6">
              <Field label={modal.email}>
                <input name="email" type="email" required className={inputClass} />
              </Field>
              <Field label={modal.ingredients}>
                <input name="ingredients" className={inputClass} />
              </Field>
              <Field label={modal.dislikes}>
                <input name="dislikes" className={inputClass} />
              </Field>
              <Field label={modal.guestCount}>
                <input name="guestCount" type="number" min={1} className={inputClass} />
              </Field>
              <Field label={modal.idea}>
                <textarea name="idea" rows={3} required className={`${inputClass} resize-none`} />
              </Field>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-2 inline-flex w-fit items-center justify-center gap-2 rounded-full bg-terracotta px-8 py-3.5 text-xs font-medium uppercase tracking-[0.18em] text-shell transition-colors hover:bg-terracotta-deep disabled:opacity-60"
              >
                {status === "submitting" ? modal.submitting : modal.submit}
                <span aria-hidden>→</span>
              </button>

              {status === "error" && <p className="text-sm text-terracotta">{modal.error}</p>}
            </form>
          </>
        )}
      </div>
    </dialog>
  );
});

export default CustomIdeaModal;
