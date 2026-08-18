import { randomBytes } from "node:crypto";

import { siteConfig } from "@/config/site";

/**
 * Generates a unique, human-readable lead id: e.g. "KF-20260810-X7K29P".
 *
 * - Unique: 5 base32 chars from a CSPRNG (~32 bits of entropy, ample for
 *   a lead tool; DB also enforces uniqueness with a retry loop).
 * - Legible: brand prefix + date + short code.
 * - Server-side only: never reveals personal data.
 */
const BRAND_CODE = (siteConfig.brandName || "KF")
  .replace(/[^A-Z0-9]/gi, "")
  .slice(0, 3)
  .toUpperCase()
  .padEnd(2, "O"); // always at least 2 chars

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O/1/I/L

function formatDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}${m}${day}`;
}

function randomCode(length: number): string {
  let out = "";
  const bytes = randomBytes(length);
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}

export function generateLeadId(now: Date = new Date()): string {
  return `${BRAND_CODE}-${formatDate(now)}-${randomCode(5)}`;
}

/** Loose validation for a lead id format (used in tests and admin search). */
export const LEAD_ID_RE = /^[A-Z]{2,3}-\d{8}-[A-Z2-9]{5}$/;
