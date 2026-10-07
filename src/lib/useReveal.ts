"use client";

import { useEffect, useRef, useState } from "react";

// Fades an element in with a slight upward slide the first time it scrolls
// into view. Pair the returned classes with Tailwind's `motion-reduce:`
// variant so prefers-reduced-motion users see the final state immediately.
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -10% 0px" },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, visible };
}
