import { describe, expect, it } from "vitest";

import {
  CONSENT_MODE_DENIED,
  consentCommandScript,
  toConsentMode,
} from "@/lib/analytics/consent-mode";

describe("Consent Mode v2", () => {
  it("denies everything by default", () => {
    expect(CONSENT_MODE_DENIED).toEqual({
      analytics_storage: "denied",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("maps analytics category to analytics_storage only", () => {
    expect(toConsentMode(true, false)).toEqual({
      analytics_storage: "granted",
      ad_storage: "denied",
      ad_user_data: "denied",
      ad_personalization: "denied",
    });
  });

  it("maps marketing category to the three ad signals", () => {
    expect(toConsentMode(false, true)).toEqual({
      analytics_storage: "denied",
      ad_storage: "granted",
      ad_user_data: "granted",
      ad_personalization: "granted",
    });
  });

  it("grants all when both categories are accepted", () => {
    const state = toConsentMode(true, true);
    expect(Object.values(state).every((v) => v === "granted")).toBe(true);
  });

  it("builds a default (denied) consent command script", () => {
    const script = consentCommandScript("default", CONSENT_MODE_DENIED);
    expect(script).toContain("gtag('consent','default'");
    expect(script).toContain('"analytics_storage":"denied"');
  });

  it("builds an update command with the granted state", () => {
    const script = consentCommandScript("update", toConsentMode(true, true));
    expect(script).toContain("gtag('consent','update'");
    expect(script).toContain('"ad_storage":"granted"');
  });
});
