"use client";

import { siteConfig } from "@/config/site";
import { analyticsAllowed } from "@/lib/consent";
import { getAttribution } from "@/lib/attribution/client";

/**
 * Consent-gated analytics client (Google Tag Manager as the central hub).
 *
 * - dataLayer is initialised before GTM needs it (see AnalyticsProvider).
 * - Business events are pushed ONLY when analytics consent is granted.
 * - NEVER sends PII: no phone, email, full name, address or user text.
 * - All ids come from env/config; an empty config is a silent no-op.
 */

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function isAnalyticsConfigured(): boolean {
  return (
    Boolean(siteConfig.analytics.gtmId) ||
    Boolean(siteConfig.analytics.ga4Id) ||
    Boolean(siteConfig.analytics.adsId)
  );
}

/** Pushes any object to the dataLayer (consent-gated, SSR-safe). */
export function pushToDataLayer(data: Record<string, unknown>): void {
  if (typeof window === "undefined") return;
  if (!isAnalyticsConfigured()) return;
  if (!analyticsAllowed()) return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(data);
}

/** Business-event helper with the event name as the first key. */
function push(event: string, payload?: Record<string, unknown>): void {
  pushToDataLayer({ event, ...payload });
}

/** Attribution carried into analytics events (non-PII only). */
function attributionPayload(): Record<string, unknown> {
  const store = getAttribution();
  return {
    first_touch_source: store?.first_touch?.source ?? null,
    last_touch_source: store?.last_touch?.source ?? null,
  };
}

/* ------------------------------------------------------------------ */
/* Form funnel                                                        */
/* ------------------------------------------------------------------ */

export function trackFormStart(): void {
  push("form_start", attributionPayload());
}

export function trackFormStepComplete(step: number): void {
  push("form_step_complete", { step, ...attributionPayload() });
}

/** Should only fire AFTER the server has accepted the lead. */
export function trackGenerateLead(leadId?: string): void {
  // Event contains the lead id but NO PII. Never send phone/email/name.
  push("generate_lead", { lead_id: leadId ?? undefined, ...attributionPayload() });
}

export function trackFormError(errorKey: string): void {
  // errorKey is a non-PII category (e.g. "validation" | "server").
  push("form_error", { error_key: errorKey, ...attributionPayload() });
}

/* ------------------------------------------------------------------ */
/* Clicks                                                             */
/* ------------------------------------------------------------------ */

export function trackClickPhone(): void {
  push("click_phone", attributionPayload());
}

export function trackClickWhatsapp(): void {
  push("click_whatsapp", attributionPayload());
}

export function trackClickCta(ctaName: string, destination: string): void {
  push("click_cta", { cta_name: ctaName, destination, ...attributionPayload() });
}

/* ------------------------------------------------------------------ */
/* Page-level                                                         */
/* ------------------------------------------------------------------ */

export function trackViewService(service: string): void {
  push("view_service", { service, ...attributionPayload() });
}

export function trackViewBudgetPage(): void {
  push("view_budget_page", attributionPayload());
}

/** SPA route change (App Router). Never emits `page_view` itself. */
export function trackRouteChange(pageLocation: string): void {
  push("next_route_change", { page_location: pageLocation, ...attributionPayload() });
}
