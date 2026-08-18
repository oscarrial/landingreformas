"use client";

import Link from "next/link";

import { CTA_ACTION_LABEL } from "@/config/site";
import { cn } from "@/lib/cn";
import { trackClickCta } from "@/lib/analytics/client";

export type CtaVariant = "solid" | "outline" | "light" | "underline";

interface CtaButtonProps {
  /** Where it points. Prefer "#presupuesto" on pages that host the form. */
  href?: string;
  label?: string;
  variant?: CtaVariant;
  className?: string;
}

const VARIANTS: Record<CtaVariant, string> = {
  solid:
    "rounded-md bg-ink py-3.5 pl-6 pr-3 text-[15px] font-semibold text-sand hover:bg-[#2a2a26]",
  outline:
    "rounded-md border border-ink py-3.5 pl-6 pr-3 text-[15px] font-semibold text-ink hover:bg-ink/[0.04]",
  light:
    "rounded-md bg-sand py-3.5 pl-6 pr-3 text-[15px] font-semibold text-ink hover:bg-white",
  underline:
    "border-b border-ink pb-1 text-sm font-semibold text-ink hover:border-bronze-deep hover:text-bronze-deep",
};

const ARROW_BG: Record<CtaVariant, string> = {
  solid: "bg-sand/15",
  outline: "bg-ink/[0.06]",
  light: "bg-ink/[0.08]",
  underline: "",
};

/**
 * The site's recurring "pedir presupuesto" action.
 *
 * Same-page targets are scrolled to in JS instead of letting the browser
 * follow the hash. A plain <Link href="#presupuesto"> writes the hash into
 * the URL, and every later click on the same link is then a no-op because
 * the URL never changes — the button appears dead from the second click on.
 * The href stays put so it still works without JS and can be opened in a
 * new tab.
 */
export function CtaButton({
  href = "#presupuesto",
  label = CTA_ACTION_LABEL,
  variant = "solid",
  className,
}: CtaButtonProps) {
  const isSamePage = href.startsWith("#");

  const onClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    trackClickCta(label, href);
    if (!isSamePage || event.metaKey || event.ctrlKey || event.shiftKey) return;
    const target = document.getElementById(href.slice(1));
    if (!target) return; // let the browser try the native jump
    const scrollTarget =
      window.matchMedia("(max-width: 767px)").matches
        ? target.querySelector<HTMLElement>("[data-mobile-form-target]") ?? target
        : target;
    event.preventDefault();
    // Smoothness comes from `html { scroll-behavior }`, which the global
    // reduced-motion block already switches off.
    scrollTarget.scrollIntoView({ block: "start" });
    // The target carries tabIndex={-1}; keyboard users land on the form too.
    scrollTarget.focus({ preventScroll: true });
  };

  const showArrow = variant !== "underline";

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group inline-flex items-center transition-[background-color,border-color,transform,color] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        showArrow && "gap-3 active:scale-[0.98]",
        VARIANTS[variant],
        className
      )}
    >
      {label}
      {showArrow ? (
        <span
          className={cn(
            "grid h-7 w-7 place-items-center rounded transition-transform duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:-translate-y-px group-hover:translate-x-0.5",
            ARROW_BG[variant]
          )}
        >
          <svg width="13" height="13" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M3 11 11 3m0 0H4.5M11 3v6.5"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      ) : null}
    </Link>
  );
}
