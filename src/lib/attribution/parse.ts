import type { AttributionParams, AttributionSource } from "@/lib/attribution/types";

/**
 * Pure helpers to build attribution data from a URL + referrer.
 * Kept free of `window` so they are unit-testable and SSR-safe.
 */

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

const CLICK_IDS = ["gclid", "gbraid", "wbraid", "fbclid", "msclkid"] as const;

const ALLOWED_PARAMS = new Set([...UTM_KEYS, ...CLICK_IDS]);

/** Extracts only the attribution query params we care about. */
export function extractAttributionParams(
  search: URLSearchParams
): AttributionParams {
  const params: AttributionParams = {
    utm_source: null,
    utm_medium: null,
    utm_campaign: null,
    utm_term: null,
    utm_content: null,
    gclid: null,
    gbraid: null,
    wbraid: null,
    fbclid: null,
    msclkid: null,
    referrer: null,
    landing_page: "/",
  };

  for (const key of ALLOWED_PARAMS) {
    const value = search.get(key);
    if (value && typeof value === "string") {
      (params as unknown as Record<string, string | null>)[key] =
        value.trim().slice(0, 500) || null;
    }
  }

  return params;
}

/** Builds a full source snapshot from a URL string + referrer + path. */
export function buildAttributionSource(
  url: string,
  referrer: string | null,
  landingPage: string
): AttributionSource {
  let search: URLSearchParams;
  try {
    search = new URL(url).searchParams;
  } catch {
    search = new URLSearchParams();
  }

  const params = extractAttributionParams(search);
  params.referrer = referrer ? referrer.slice(0, 2000) : null;
  params.landing_page = landingPage.slice(0, 500) || "/";
  return params;
}

/** Human-readable source label (used for first/last touch and admin). */
export function deriveSource(params: {
  utm_source: string | null;
  gclid: string | null;
  fbclid: string | null;
  msclkid: string | null;
  referrer: string | null;
}): string {
  if (params.utm_source) return params.utm_source;
  if (params.gclid) return "google";
  if (params.fbclid) return "facebook";
  if (params.msclkid) return "bing";
  if (params.referrer) {
    try {
      const host = new URL(params.referrer).hostname.replace(/^www\./, "");
      return host || "direct";
    } catch {
      return "direct";
    }
  }
  return "direct";
}

/** Canonical attribution object sent with the lead. */
export function toLeadAttribution(params: AttributionSource): {
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  msclkid: string | null;
} {
  const { utm_source, utm_medium, utm_campaign, utm_term, utm_content, gclid, gbraid, wbraid, fbclid, msclkid } =
    params;
  return {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    gclid,
    gbraid,
    wbraid,
    fbclid,
    msclkid,
  };
}
