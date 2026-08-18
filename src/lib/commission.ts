import type { CommissionBasis } from "@/config/site";

export interface CommissionParams {
  /** Amount on which the commission is calculated (euros). */
  contractAmount: number | null;
  collectedAmount: number | null;
  basis: CommissionBasis;
  rate: number;
}

export interface CommissionResult {
  /** Basis amount actually used for the calculation. */
  baseAmount: number;
  /** Commission amount in euros. */
  amount: number;
}

/**
 * Computes the commission for a lead.
 * We never assume which amount is the correct basis — it is configurable
 * per lead (`commission_basis`) and this function only applies the rule.
 */
export function computeCommission({
  contractAmount,
  collectedAmount,
  basis,
  rate,
}: CommissionParams): CommissionResult | null {
  const baseAmount =
    basis === "contract_amount" ? contractAmount : collectedAmount;

  if (baseAmount === null || baseAmount === undefined || Number.isNaN(baseAmount)) {
    return null;
  }

  return {
    baseAmount,
    amount: baseAmount * rate,
  };
}
