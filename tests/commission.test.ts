import { describe, expect, it } from "vitest";

import { computeCommission } from "@/lib/commission";

describe("computeCommission", () => {
  it("uses collected_amount by default basis", () => {
    const r = computeCommission({
      contractAmount: 50000,
      collectedAmount: 30000,
      basis: "collected_amount",
      rate: 0.05,
    });
    expect(r?.baseAmount).toBe(30000);
    expect(r?.amount).toBe(1500);
  });

  it("uses contract_amount when basis is contract_amount", () => {
    const r = computeCommission({
      contractAmount: 50000,
      collectedAmount: 30000,
      basis: "contract_amount",
      rate: 0.05,
    });
    expect(r?.baseAmount).toBe(50000);
    expect(r?.amount).toBe(2500);
  });

  it("returns null when the basis amount is missing", () => {
    expect(
      computeCommission({
        contractAmount: null,
        collectedAmount: null,
        basis: "collected_amount",
        rate: 0.05,
      })
    ).toBeNull();
  });

  it("respects a configurable rate", () => {
    const r = computeCommission({
      contractAmount: 10000,
      collectedAmount: null,
      basis: "contract_amount",
      rate: 0.08,
    });
    expect(r?.amount).toBe(800);
  });

  it("handles zero amounts", () => {
    const r = computeCommission({
      contractAmount: 0,
      collectedAmount: 0,
      basis: "collected_amount",
      rate: 0.05,
    });
    expect(r?.amount).toBe(0);
  });
});
