"use client";
import { useReveal } from "@/lib/useReveal";

export default function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const { ref } = useReveal<HTMLDivElement>();
  return <div ref={ref} className={`transition-all duration-1000 ease-out data-[reveal=pending]:opacity-0 data-[reveal=pending]:translate-y-8 motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${className}`}>{children}</div>;
}
