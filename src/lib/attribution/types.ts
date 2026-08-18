/** Attribution-related shared types. */

export interface AttributionParams {
  /** Query parameter values (already URL-decoded by URLSearchParams). */
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
  /** Referrer (full URL) or null. */
  referrer: string | null;
  /** Current page pathname, e.g. /reformas-cocinas-madrid. */
  landing_page: string;
}

export type AttributionSource = AttributionParams;

export interface TouchRecord {
  source: string;
  landing_page: string;
  referrer: string | null;
  captured_at: string;
}

export interface AttributionStore {
  version: 1;
  first_touch: TouchRecord | null;
  last_touch: TouchRecord | null;
}
