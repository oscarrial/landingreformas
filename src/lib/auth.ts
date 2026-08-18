import { createHmac, createHash, timingSafeEqual } from "node:crypto";

/**
 * Admin authentication.
 *
 * - Password: either ADMIN_PASSWORD_HASH (sha256 hex — recommended) or a
 *   plain ADMIN_PASSWORD (dev convenience, logged as a warning).
 * - Session: signed HttpOnly cookie (`oc_admin`) with HMAC-SHA256 over an
 *   expiry payload. Works in the Node.js runtime (Next 16 proxy + routes).
 */

export const SESSION_COOKIE = "kf_admin";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 16) {
    throw new Error(
      "AUTH_SECRET must be set (>= 16 chars) to protect the admin area."
    );
  }
  return secret;
}

export function hashPassword(password: string): string {
  return createHash("sha256").update(password).digest("hex");
}

function configuredHash(): string | null {
  return process.env.ADMIN_PASSWORD_HASH ?? null;
}

function configuredPlain(): string | null {
  return process.env.ADMIN_PASSWORD ?? null;
}

/** Returns true when admin credentials are configured at all. */
export function isAdminConfigured(): boolean {
  return Boolean(configuredHash() || configuredPlain());
}

function safeEqualHex(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

/** Verify a submitted password against the configured admin credentials. */
export function verifyAdminPassword(password: string): boolean {
  const hash = configuredHash();
  if (hash) {
    return safeEqualHex(hashPassword(password), hash);
  }
  const plain = configuredPlain();
  if (!plain) return false;
  if (!plain.startsWith("$")) {
    // Dev convenience: compare plain text. Warn loudly.
    console.warn(
      "[auth] ADMIN_PASSWORD used in plain text. Prefer ADMIN_PASSWORD_HASH."
    );
  }
  return safeEqualHex(password, plain);
}

function sign(payload: string, secret: string): string {
  return createHmac("sha256", secret).update(payload).digest("base64url");
}

function toBase64Url(s: string): string {
  return Buffer.from(s, "utf8").toString("base64url");
}

function fromBase64Url(s: string): string {
  return Buffer.from(s, "base64url").toString("utf8");
}

/** Creates a signed session token valid for SESSION_TTL_MS. */
export function createSessionToken(now: Date = new Date()): string {
  const secret = getSecret();
  const payload = toBase64Url(
    JSON.stringify({ exp: now.getTime() + SESSION_TTL_MS })
  );
  return `${payload}.${sign(payload, secret)}`;
}

/** Verifies a session token (format + signature + expiry). */
export function verifySessionToken(token: string | undefined | null): boolean {
  if (!token) return false;
  const secret = getSecret();
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const expected = sign(payload, secret);
  const a = Buffer.from(sig, "utf8");
  const b = Buffer.from(expected, "utf8");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

  try {
    const data = JSON.parse(fromBase64Url(payload)) as { exp?: number };
    if (typeof data.exp !== "number") return false;
    return data.exp > Date.now();
  } catch {
    return false;
  }
}

/** Generates a fresh ADMIN_PASSWORD_HASH (helper, e.g. for docs). */
export function generatePasswordHash(password: string): string {
  return hashPassword(password);
}
