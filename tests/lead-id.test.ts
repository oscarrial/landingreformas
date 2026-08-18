import { describe, expect, it } from "vitest";

import { generateLeadId, LEAD_ID_RE } from "@/lib/lead-id";

describe("generateLeadId", () => {
  it("produces a valid, readable, unique id", () => {
    const ids = new Set<string>();
    for (let i = 0; i < 1000; i++) {
      const id = generateLeadId(new Date(2026, 7, 10));
      ids.add(id);
      expect(id).toMatch(LEAD_ID_RE);
      // Embedded date (no personal data)
      expect(id).toContain("20260810");
    }
    expect(ids.size).toBe(1000);
  });

  it("contains only safe chars (no 0/O/1/I/L for legibility)", () => {
    const id = generateLeadId();
    const tail = id.split("-")[2]!;
    expect(tail).not.toMatch(/[0O1IL]/);
  });

  it("is server-renderable (no window/localStorage)", () => {
    const id = generateLeadId();
    expect(id.length).toBeGreaterThan(10);
  });
});
