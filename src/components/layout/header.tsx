"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { CTA_ACTION_LABEL, siteConfig } from "@/config/site";
import { trackClickCta } from "@/lib/analytics/client";
import { cn } from "@/lib/cn";

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isActive = (href: string) =>
    href.startsWith("/#") ? false : pathname === href;

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        scrolled || open
          ? "border-b border-line bg-paper/90 backdrop-blur"
          : "border-b border-transparent bg-transparent"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link
          href="/"
          className="flex flex-col leading-none"
          onClick={() => setOpen(false)}
        >
          <span className="text-lg font-extrabold uppercase tracking-tight text-ink">
            {siteConfig.brandName.split(" ")[0]}
            {siteConfig.brandName.split(" ")[1] ? (
              <span className="ml-1.5">{siteConfig.brandName.split(" ")[1]}</span>
            ) : null}
          </span>
          <span className="mt-1 text-[8px] font-semibold uppercase tracking-[0.2em] text-ink-soft">
            {siteConfig.descriptor}
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-medium">
            {siteConfig.nav.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "transition-colors hover:text-ink",
                    isActive(item.href)
                      ? "text-ink underline underline-offset-4"
                      : "text-ink-soft"
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/presupuesto"
            onClick={() => trackClickCta(CTA_ACTION_LABEL, "/presupuesto")}
            className="hidden rounded-md bg-ink px-5 py-2.5 text-sm font-semibold text-sand transition-colors hover:bg-[#2a2a26] lg:inline-flex"
          >
            {CTA_ACTION_LABEL}
          </Link>
          <button
            type="button"
            className="relative flex h-10 w-10 items-center justify-center rounded-md border border-ink lg:hidden"
            aria-expanded={open}
            aria-controls="site-mobile-menu"
            aria-label={open ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setOpen((v) => !v)}
          >
            <span
              className={cn(
                "absolute h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]",
                open ? "translate-y-0 rotate-45" : "-translate-y-1.5"
              )}
            />
            <span
              className={cn(
                "absolute h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]",
                open ? "scale-x-0 opacity-0" : "scale-x-100 opacity-100"
              )}
            />
            <span
              className={cn(
                "absolute h-0.5 w-5 rounded-full bg-ink transition-all duration-300 ease-[cubic-bezier(0.76,0,0.24,1)]",
                open ? "translate-y-0 -rotate-45" : "translate-y-1.5"
              )}
            />
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="site-mobile-menu"
          aria-label="Móvil"
          className="border-t border-line bg-paper lg:hidden"
        >
          <ul className="mx-auto max-w-6xl space-y-1 px-4 py-4">
            {siteConfig.nav.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block px-2 py-3 text-base font-semibold text-ink hover:text-ink-soft"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                href="/presupuesto"
                onClick={() => setOpen(false)}
                className="block rounded-md bg-ink px-4 py-3 text-center text-base font-semibold text-sand"
              >
                {CTA_ACTION_LABEL}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
