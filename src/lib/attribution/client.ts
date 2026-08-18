"use client";

import type { AttributionSource, AttributionStore, TouchRecord } from "@/lib/attribution/types";
import {
  buildAttributionSource,
  deriveSource,
} from "@/lib/attribution/parse";

/**
 * First-party first-touch / last-touch attribution persistence.
 *
 * - On first visit: writes both first_touch and last_touch.
 * - On later visits: KEEPS first_touch, updates last_touch.
 * - Versioned localStorage key so schema changes never break reads.
 * - All reads wrapped in try/catch (Safari private mode / disabled storage).
 */

const STORAGE_KEY = "koflat.attribution.v1";
const VERSION = 1;

function safeGet(): AttributionStore | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AttributionStore;
    if (parsed?.version !== VERSION) return null;
    return parsed;
  } catch {
    return null;
  }
}

function safeSet(store: AttributionStore): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // storage unavailable — attribution silently degraded
  }
}

function captureCurrent(): AttributionSource {
  return buildAttributionSource(
    window.location.href,
    document.referrer || null,
    window.location.pathname + window.location.search
  );
}

function toTouch(source: AttributionSource): TouchRecord {
  return {
    source: deriveSource(source),
    landing_page: source.landing_page,
    referrer: source.referrer,
    captured_at: new Date().toISOString(),
  };
}

/**
 * Records attribution for the current page. Called on every route change
 * (see the client layout/provider). Keeps first_touch, updates last_touch.
 */
export function trackAttribution(): AttributionStore {
  const current = captureCurrent();
  const store = safeGet() ?? { version: VERSION, first_touch: null, last_touch: null };

  if (!store.first_touch) {
    store.first_touch = toTouch(current);
  }
  store.last_touch = toTouch(current);

  safeSet(store);
  return store;
}

/** Returns the persisted attribution store without mutating it. */
export function getAttribution(): AttributionStore | null {
  return safeGet();
}

/** Merged attribution for the lead form POST. */
export function buildLeadAttribution(): AttributionStore & {
  current_source: AttributionSource;
} {
  const store = getAttribution() ?? {
    version: VERSION,
    first_touch: null,
    last_touch: null,
  };
  return { ...store, current_source: captureCurrent() };
}
