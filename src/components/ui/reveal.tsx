"use client";

import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/cn";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Stagger delay in ms. */
  delay?: number;
}

/**
 * Progressive-enhancement scroll reveal.
 *
 * Content is VISIBLE by default (SSR + no-JS safe). Only when JS runs and
 * the element starts below the fold does it animate in on scroll. This
 * guarantees the page never looks empty if scripts are blocked.
 *
 * - Animates only `transform`/`opacity` (GPU-safe).
 * - Disabled entirely for prefers-reduced-motion.
 */
export function Reveal({ children, className, delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // Hide only elements that are below the fold at mount; reveal on scroll.
    const id = requestAnimationFrame(() => {
      const rect = el.getBoundingClientRect();
      if (rect.top > window.innerHeight) {
        setVisible(false);

        const observer = new IntersectionObserver(
          (entries) => {
            for (const entry of entries) {
              if (entry.isIntersecting) {
                setVisible(true);
                observer.disconnect();
              }
            }
          },
          { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
        );
        observer.observe(el);
      }
    });

    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-[opacity,transform] duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] will-change-[opacity,transform]",
        visible ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        className
      )}
    >
      {children}
    </div>
  );
}
