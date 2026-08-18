"use client";

/**
 * Google Consent Mode v2.
 *
 * Maps the site's consent categories to the four Consent Mode signals and
 * builds the dataLayer commands. Default is DENIED; it is updated when the
 * visitor accepts / rejects / changes their preferences (see cookie-banner).
 *
 * Reference:
 * https://developers.google.com/tag-platform/security/guides/consent?hl=es
 */

export interface ConsentModeState {
  analytics_storage: "granted" | "denied";
  ad_storage: "granted" | "denied";
  ad_user_data: "granted" | "denied";
  ad_personalization: "granted" | "denied";
}

export const CONSENT_MODE_DENIED: ConsentModeState = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

/**
 * Category → Consent Mode mapping:
 * - `analytics`  → analytics_storage
 * - `marketing`  → ad_storage, ad_user_data, ad_personalization
 * Necessary cookies are always active and never mapped to a signal.
 */
export function toConsentMode(
  analytics: boolean,
  marketing: boolean
): ConsentModeState {
  return {
    analytics_storage: analytics ? "granted" : "denied",
    ad_storage: marketing ? "granted" : "denied",
    ad_user_data: marketing ? "granted" : "denied",
    ad_personalization: marketing ? "granted" : "denied",
  };
}

/** Inline script that pushes a consent command to the dataLayer. */
export function consentCommandScript(
  command: "default" | "update",
  state: ConsentModeState
): string {
  return `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('consent','${command}',${JSON.stringify(state)});`;
}
