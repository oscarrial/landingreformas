"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Guarantees the page starts at the top on entry and on every navigation.
 * Prevents the browser restoring a previous scroll position (e.g. bottom).
 */
export function ScrollToTop() {
  const pathname = usePathname();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    const hash = window.location.hash.slice(1);
    if (hash) {
      const frame = requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ block: "start" });
      });
      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  }, [pathname]);

  return null;
}
