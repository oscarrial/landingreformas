"use client";

import { useEffect, useState } from "react";

import type { ConsentState } from "@/lib/consent";
import {
  CONSENT_DEFAULTS,
  dispatchConsentChanged,
  hasConsentDecision,
  saveConsent,
} from "@/lib/consent";

type BannerState = "hidden" | "banner" | "preferences";

/**
 * Elegant, low-intrusion cookie banner.
 * - Aceptar / Rechazar are visually equivalent (both solid buttons).
 * - "Configurar" opens a preferences panel (Necesarias / Analítica / Marketing).
 * - Saving always persists the cookie AND notifies Consent Mode v2 via the
 *   `consent:changed` event (the AnalyticsProvider applies it and loads GTM).
 */
export function CookieBanner() {
  const [state, setState] = useState<BannerState>("hidden");
  const [consent, setConsent] = useState<ConsentState>(CONSENT_DEFAULTS);

  useEffect(() => {
    if (hasConsentDecision()) return;
    // Small delay so the banner doesn't jump in before first paint.
    const t = setTimeout(() => setState("banner"), 600);
    return () => clearTimeout(t);
  }, []);

  const commit = (next: ConsentState) => {
    saveConsent(next);
    dispatchConsentChanged();
    setState("hidden");
  };

  const acceptAll = () => {
    commit({ necessary: true, analytics: true, marketing: true });
  };

  const rejectAll = () => {
    commit(CONSENT_DEFAULTS);
  };

  const savePrefs = () => {
    commit(consent);
  };

  if (state === "hidden") return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-label="Configuración de cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-paper px-4 py-5 shadow-[0_-8px_30px_rgba(31,26,19,0.08)]"
    >
      <div className="mx-auto max-w-4xl">
        {state === "banner" ? (
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-2xl text-sm text-ink-soft">
              <span className="font-semibold text-ink">Cookies.</span>{" "}
              Usamos cookies necesarias para el funcionamiento del sitio y, si
              nos lo permites, cookies de analítica y marketing para mejorar tu
              experiencia. Puedes gestionarlas en cualquier momento.
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={rejectAll}
                className="btn-outline px-4 py-2.5 text-sm"
              >
                Rechazar
              </button>
              <button
                type="button"
                onClick={() => setState("preferences")}
                className="btn-outline px-4 py-2.5 text-sm"
              >
                Configurar
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="btn-primary px-5 py-2.5 text-sm"
              >
                Aceptar todas
              </button>
            </div>
          </div>
        ) : (
          <div>
            <h2 className="font-display text-xl text-ink">
              Preferencias de cookies
            </h2>
            <p className="mt-1 text-sm text-ink-soft">
              Elige qué cookies permites. Las necesarias siempre están activas.
            </p>
            <div className="mt-4 space-y-3">
              <PreferenceRow
                title="Necesarias"
                description="Imprescindibles para que el sitio funcione. No requieren consentimiento."
                locked
              />
              <PreferenceRow
                title="Analítica"
                description="Nos ayudan a entender cómo se usa el sitio y a mejorar la experiencia (GA4 / GTM)."
                checked={consent.analytics}
                onChange={(v) => setConsent((c) => ({ ...c, analytics: v }))}
              />
              <PreferenceRow
                title="Marketing"
                description="Permiten medir campañas y anuncios (Google Ads, Meta)."
                checked={consent.marketing}
                onChange={(v) => setConsent((c) => ({ ...c, marketing: v }))}
              />
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={rejectAll}
                className="btn-outline px-4 py-2.5 text-sm"
              >
                Rechazar todo
              </button>
              <button
                type="button"
                onClick={acceptAll}
                className="btn-outline px-4 py-2.5 text-sm"
              >
                Aceptar todo
              </button>
              <button
                type="button"
                onClick={savePrefs}
                className="btn-primary px-5 py-2.5 text-sm"
              >
                Guardar preferencias
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function PreferenceRow({
  title,
  description,
  checked,
  onChange,
  locked,
}: {
  title: string;
  description: string;
  checked?: boolean;
  onChange?: (v: boolean) => void;
  locked?: boolean;
}) {
  return (
    <label className="flex items-start justify-between gap-6 border-t border-line pt-3">
      <span>
        <span className="block font-semibold text-ink">{title}</span>
        <span className="mt-0.5 block text-sm text-ink-soft">{description}</span>
      </span>
      {locked ? (
        <span className="mt-0.5 inline-flex items-center rounded-full bg-sand px-3 py-1 text-xs font-medium uppercase tracking-wide text-ink-soft">
          Siempre
        </span>
      ) : (
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange?.(e.target.checked)}
          className="mt-1 h-5 w-5 accent-bronze-deep"
        />
      )}
    </label>
  );
}
