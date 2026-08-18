import { describe, expect, it } from "vitest";

import { leadSchema } from "@/lib/validation/lead";

const validPayload = {
  reform_type: "vivienda_completa",
  size_m2: 90,
  area: "madrid",
  start_timeframe: "1_3_meses",
  name: "Ana García",
  phone: "600 123 456",
  email: "ana@example.es",
  consent: true,
  website: "",
  attribution: {},
};

describe("leadSchema", () => {
  it("accepts a valid payload", () => {
    const parsed = leadSchema.safeParse(validPayload);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      expect(parsed.data.name).toBe("Ana García");
      expect(parsed.data.email).toBe("ana@example.es");
      expect(parsed.data.size_m2).toBe(90);
    }
  });

  it("rejects empty name", () => {
    const parsed = leadSchema.safeParse({ ...validPayload, name: "  " });
    expect(parsed.success).toBe(false);
  });

  it("rejects bad phone", () => {
    const parsed = leadSchema.safeParse({ ...validPayload, phone: "abc" });
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid surface", () => {
    const parsed = leadSchema.safeParse({ ...validPayload, size_m2: 5 });
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid area", () => {
    const parsed = leadSchema.safeParse({ ...validPayload, area: "carabanchel" });
    expect(parsed.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const parsed = leadSchema.safeParse({ ...validPayload, email: "not-an-email" });
    expect(parsed.success).toBe(false);
  });

  it("rejects missing consent", () => {
    const parsed = leadSchema.safeParse({ ...validPayload, consent: false });
    expect(parsed.success).toBe(false);
  });

  it("treats empty email as null", () => {
    const parsed = leadSchema.safeParse({ ...validPayload, email: "" });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.email).toBeNull();
  });

  it("allows unknown surface (null)", () => {
    const parsed = leadSchema.safeParse({ ...validPayload, size_m2: null });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.size_m2).toBeNull();
  });

  it("allows a non-empty honeypot to pass validation (checked separately)", () => {
    const parsed = leadSchema.safeParse({ ...validPayload, website: "bot" });
    expect(parsed.success).toBe(true);
  });
});
