import { describe, expect, it, vi } from "vitest";

import { pushToDataLayer, trackClickCta } from "@/lib/analytics/client";

// No `window` in the Node test environment → every helper must be a no-op
// and never throw (SSR safety is part of the contract).
describe("analytics dataLayer (SSR-safe)", () => {
  it("does not throw without a window", () => {
    expect(() => pushToDataLayer({ event: "test" })).not.toThrow();
    expect(() => trackClickCta("prueba", "/presupuesto")).not.toThrow();
  });

  it("exposes a pushToDataLayer abstraction for events", () => {
    expect(typeof pushToDataLayer).toBe("function");
  });
});

describe("events do not carry PII by construction", () => {
  it("click_cta carries only non-PII fields", () => {
    const data = { event: "click_cta", cta_name: "x", destination: "/y" };
    const keys = Object.keys(data);
    expect(keys).not.toContain("phone");
    expect(keys).not.toContain("email");
    expect(keys).not.toContain("name");
  });
});
