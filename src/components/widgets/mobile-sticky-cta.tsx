"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { siteConfig } from "@/config/site";
import { trackClickWhatsapp } from "@/lib/analytics/client";

/**
 * Mobile sticky bottom CTA — appears after the user scrolls past the hero.
 * Hidden on /presupuesto (the form lives there and must never be covered).
 * Respects safe-area-inset for iPhones; buttons are ≥ 44px tall.
 */
export function MobileStickyCta() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 560);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (pathname === "/presupuesto") return null;

  const hasWhatsapp = Boolean(siteConfig.whatsapp.trim());

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 transition-transform duration-300 lg:hidden ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="border-t border-line bg-paper/95 px-3 py-2 backdrop-blur">
        <div className="mx-auto flex max-w-lg gap-2">
          {hasWhatsapp ? (
            <a
              href={`https://wa.me/${siteConfig.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Escribir por WhatsApp"
              onClick={() => trackClickWhatsapp()}
              className="flex min-h-11 w-16 items-center justify-center rounded-[0.125rem] border border-line text-ink"
            >
              <svg viewBox="0 0 32 32" width="22" height="22" fill="currentColor" aria-hidden="true">
                <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6c1.7.8 3.7 1.3 5.7 1.3 6.6 0 12-5.4 12-12S22.6 3 16 3zm5.8 16.9c-.3.8-1.5 1.5-2.4 1.7-.6.1-1.4.2-4.1-.9-3.4-1.3-5.6-4.7-5.8-4.9-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.9c.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.8 1 2.6 1.1 2.8.1.2.1.4 0 .6-.1.2-.1.4-.3.6-.2.2-.4.5-.5.6-.2.2-.4.4-.2.7.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.8.3.2.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2.3.1 1.8.9 2.1 1 .3.2.5.3.6.4.1.3.1.9-.2 1.6z" />
              </svg>
            </a>
          ) : null}
          <Link
            href="/presupuesto"
            className="btn-primary min-h-11 flex-1 justify-center text-base"
          >
            Pedir presupuesto
          </Link>
        </div>
      </div>
    </div>
  );
}
