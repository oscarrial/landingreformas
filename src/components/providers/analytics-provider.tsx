"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import { siteConfig } from "@/config/site";
import {
  CONSENT_CHANGED_EVENT,
  readConsent,
  type ConsentState,
} from "@/lib/consent";
import {
  CONSENT_MODE_DENIED,
  consentCommandScript,
  toConsentMode,
} from "@/lib/analytics/consent-mode";
import {
  trackRouteChange,
  trackViewBudgetPage,
  trackViewService,
} from "@/lib/analytics/client";
import { trackAttribution } from "@/lib/attribution/client";

/**
 * Analytics bootstrap — Google Tag Manager as the central hub.
 *
 * Order (critical):
 *  1. dataLayer init + gtag stub.
 *  2. Consent Mode v2 DEFAULT = denied.
 *  3. (if decided) Consent Mode UPDATE with the visitor's choices.
 *  4. GTM loader (only when analytics consent is granted and gtmId is set).
 *  5. Direct GA4 gtag ONLY as fallback when no GTM container is configured
 *     (avoids double-loading when both are present).
 *
 * Page views (App Router): Next uses client-side navigation, so we push
 * `next_route_change` on route changes (never `page_view` — that would
 * double-count with GTM's built-in page view). Configure the GA4 tag in GTM
 * to fire on `next_route_change` for SPA navigation; see docs/SEO_ANALYTICS.md.
 */
export function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [consent, setConsent] = useState<ConsentState | null>(null);
  const firstRoute = useRef(true);

  const refreshConsent = useCallback(() => setConsent(readConsent()), []);

  useEffect(() => {
    const id = requestAnimationFrame(refreshConsent);
    window.addEventListener(CONSENT_CHANGED_EVENT, refreshConsent);
    window.addEventListener("storage", refreshConsent);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener(CONSENT_CHANGED_EVENT, refreshConsent);
      window.removeEventListener("storage", refreshConsent);
    };
  }, [refreshConsent]);

  // First-party attribution per page view.
  useEffect(() => {
    trackAttribution();
  }, [pathname]);

  // SPA route change — skip the initial load (GTM's own page view covers it).
  useEffect(() => {
    if (firstRoute.current) {
      firstRoute.current = false;
      return;
    }
    trackRouteChange(pathname);
  }, [pathname]);

  // Page-level business events.
  useEffect(() => {
    if (pathname === "/presupuesto") {
      trackViewBudgetPage();
      return;
    }
    const match = pathname.match(/^\/(reformas-[a-z-]+)$/);
    if (match) trackViewService(match[1]);
  }, [pathname]);

  const { gtmId, ga4Id } = siteConfig.analytics;
  const configured = Boolean(gtmId) || Boolean(ga4Id);
  const analyticsOn = consent?.analytics ?? false;
  const marketingOn = consent?.marketing ?? false;
  const loadTags = consent ? analyticsOn : false;
  const granted = toConsentMode(analyticsOn, marketingOn);

  return (
    <>
      {children}

      {configured ? (
        <>
          <Script id="dl-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}`}
          </Script>
          <Script id="consent-default" strategy="afterInteractive">
            {consentCommandScript("default", CONSENT_MODE_DENIED)}
          </Script>
        </>
      ) : null}

      {configured && consent ? (
        <Script id="consent-update" strategy="afterInteractive">
          {consentCommandScript("update", granted)}
        </Script>
      ) : null}

      {loadTags && gtmId ? (
        <>
          <Script id="gtm-init" strategy="afterInteractive">
            {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','${gtmId}');`}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        </>
      ) : null}

      {/* GA4 only as a fallback when GTM is not configured. */}
      {loadTags && !gtmId && ga4Id ? (
        <Script id="ga4-fallback" strategy="afterInteractive">
          {`gtag('js',new Date());gtag('config','${ga4Id}',{ 'page_path': location.pathname });`}
        </Script>
      ) : null}
    </>
  );
}
