"use client";

import { siteConfig } from "@/config/site";
import { trackClickWhatsapp } from "@/lib/analytics/client";

/**
 * Floating WhatsApp button — desktop only (mobile uses the sticky bar).
 * Hidden when no number is configured.
 */
export function WhatsAppButton() {
  const number = siteConfig.whatsapp.trim();
  if (!number) return null;

  const href = `https://wa.me/${number.replace(/[^0-9]/g, "")}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escríbenos por WhatsApp"
      onClick={() => trackClickWhatsapp()}
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-[calc(1.25rem+env(safe-area-inset-right))] z-40 hidden h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg transition-transform hover:scale-105 lg:flex"
    >
      <svg viewBox="0 0 32 32" width="26" height="26" fill="currentColor" aria-hidden="true">
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.1 1.6 5.9L4 29l8.3-1.6c1.7.8 3.7 1.3 5.7 1.3 6.6 0 12-5.4 12-12S22.6 3 16 3zm5.8 16.9c-.3.8-1.5 1.5-2.4 1.7-.6.1-1.4.2-4.1-.9-3.4-1.3-5.6-4.7-5.8-4.9-.2-.2-1.4-1.9-1.4-3.6s.9-2.5 1.2-2.9c.3-.3.7-.4.9-.4h.7c.2 0 .5-.1.8.6.3.8 1 2.6 1.1 2.8.1.2.1.4 0 .6-.1.2-.1.4-.3.6-.2.2-.4.5-.5.6-.2.2-.4.4-.2.7.2.3.9 1.5 2 2.4 1.4 1.2 2.5 1.6 2.9 1.8.3.2.5.1.7-.1.2-.2.8-.9 1-1.2.2-.3.4-.3.7-.2.3.1 1.8.9 2.1 1 .3.2.5.3.6.4.1.3.1.9-.2 1.6z" />
      </svg>
    </a>
  );
}
