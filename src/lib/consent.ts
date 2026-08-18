"use client";

/**
 * Cookie consent management (client-side).
 *
 * Stored in a readable (non-HttpOnly) cookie so the server and analytics can
 * read it too. Non-essential tools must not load until consent matches.
 *
 * The name matches the one the group publishes in its cookie policy at
 * intelia-group.com, and /cookies renders CONSENT_COOKIE directly, so the
 * documented inventory cannot drift from what the site actually sets.
 */

export interface ConsentState {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
}

export const CONSENT_COOKIE = "intelia_consent_v1";
/** 12 months, as stated in the published cookie policy. */
export const CONSENT_MAX_AGE_MONTHS = 12;
const MAX_AGE = 60 * 60 * 24 * 365;

export const CONSENT_DEFAULTS: ConsentState = {
  necessary: true,
  analytics: false,
  marketing: false,
};

export function parseConsentCookie(value: string | null | undefined): ConsentState {
  if (!value) return { ...CONSENT_DEFAULTS };
  try {
    const parsed = JSON.parse(decodeURIComponent(value)) as Partial<ConsentState>;
    return {
      necessary: true,
      analytics: Boolean(parsed.analytics),
      marketing: Boolean(parsed.marketing),
    };
  } catch {
    return { ...CONSENT_DEFAULTS };
  }
}

export function readConsent(): ConsentState {
  if (typeof document === "undefined") return { ...CONSENT_DEFAULTS };
  const match = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${CONSENT_COOKIE}=`));
  return parseConsentCookie(match?.split("=").slice(1).join("="));
}

export function saveConsent(state: ConsentState): void {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(JSON.stringify(state));
  document.cookie = `${CONSENT_COOKIE}=${value};path=/;max-age=${MAX_AGE};samesite=lax`;
}

export function hasConsentDecision(): boolean {
  if (typeof document === "undefined") return false;
  return document.cookie.includes(`${CONSENT_COOKIE}=`);
}

export function analyticsAllowed(): boolean {
  return readConsent().analytics;
}

export function marketingAllowed(): boolean {
  return readConsent().marketing;
}

/** Broadcast consent changes so providers (GTM, analytics) can react. */
export const CONSENT_CHANGED_EVENT = "koflat:consent";

export function dispatchConsentChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent(CONSENT_CHANGED_EVENT));
}
