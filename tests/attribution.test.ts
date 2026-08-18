import { describe, expect, it } from "vitest";

import {
  buildAttributionSource,
  deriveSource,
  extractAttributionParams,
} from "@/lib/attribution/parse";

describe("extractAttributionParams", () => {
  it("extracts only allowed UTM + click-id params", () => {
    const search = new URLSearchParams(
      "utm_source=google&utm_campaign=verano&gclid=abc123&evil=drop&utm_medium=cpc"
    );
    const params = extractAttributionParams(search);
    expect(params.utm_source).toBe("google");
    expect(params.utm_campaign).toBe("verano");
    expect(params.utm_medium).toBe("cpc");
    expect(params.gclid).toBe("abc123");
    expect((params as unknown as Record<string, string | null>).evil).toBeUndefined();
  });

  it("caps values at 500 chars", () => {
    const search = new URLSearchParams({
      utm_campaign: "x".repeat(2000),
    });
    const params = extractAttributionParams(search);
    expect(params.utm_campaign!.length).toBe(500);
  });

  it("drops empty values", () => {
    const search = new URLSearchParams({ utm_source: "", gclid: "  " });
    const params = extractAttributionParams(search);
    expect(params.utm_source).toBeNull();
    expect(params.gclid).toBeNull();
  });
});

describe("buildAttributionSource", () => {
  it("captures landing page and referrer", () => {
    const source = buildAttributionSource(
      "https://site.example/reformas-cocinas-madrid?utm_source=meta",
      "https://facebook.com/",
      "/reformas-cocinas-madrid"
    );
    expect(source.landing_page).toBe("/reformas-cocinas-madrid");
    expect(source.referrer).toBe("https://facebook.com/");
    expect(source.utm_source).toBe("meta");
  });

  it("handles malformed URLs without throwing", () => {
    expect(() =>
      buildAttributionSource("not-a-url", null, "/")
    ).not.toThrow();
  });
});

describe("deriveSource", () => {
  it("prefers utm_source over click ids", () => {
    expect(deriveSource({ utm_source: "bing", gclid: "g", fbclid: "f", msclkid: "m", referrer: null })).toBe("bing");
  });

  it("maps click ids to platforms", () => {
    expect(deriveSource({ utm_source: null, gclid: "abc", fbclid: null, msclkid: null, referrer: null })).toBe("google");
    expect(deriveSource({ utm_source: null, gclid: null, fbclid: "abc", msclkid: null, referrer: null })).toBe("facebook");
    expect(deriveSource({ utm_source: null, gclid: null, fbclid: null, msclkid: "abc", referrer: null })).toBe("bing");
  });

  it("derives source from referrer hostname", () => {
    expect(deriveSource({ utm_source: null, gclid: null, fbclid: null, msclkid: null, referrer: "https://www.google.es/" })).toBe("google.es");
  });

  it("falls back to direct", () => {
    expect(deriveSource({ utm_source: null, gclid: null, fbclid: null, msclkid: null, referrer: null })).toBe("direct");
  });
});
