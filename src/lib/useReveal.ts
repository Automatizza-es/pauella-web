"use client";

import { useEffect, useRef } from "react";

// Server HTML and the first client render are visible. Only arm off-screen
// elements after hydration, so late hydration / restored scroll never hides
// content the visitor has already seen. CSS transitions keep their own timing.
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motion.matches || el.getBoundingClientRect().top < window.innerHeight) return;

    let observer: IntersectionObserver | undefined;
    function reveal() {
      delete el!.dataset.reveal;
      observer?.disconnect();
    }

    try {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) reveal();
        },
        { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
      );
      observer.observe(el);
      el.dataset.reveal = "pending";
    } catch {
      // Unsupported or failing observers must never make content unreadable.
      reveal();
      return;
    }

    const onMotionChange = () => {
      if (motion.matches) reveal();
    };
    motion.addEventListener("change", onMotionChange);
    el.addEventListener("focusin", reveal);
    return () => {
      reveal();
      motion.removeEventListener("change", onMotionChange);
      el.removeEventListener("focusin", reveal);
    };
  }, []);

  return { ref };
}
