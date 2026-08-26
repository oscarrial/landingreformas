/**
 * In-memory sliding-window rate limiter.
 * MVP note: suitable for single-instance deployments. For multi-instance
 * serverless, swap the store for Redis/Vercel KV keeping the same interface.
 */

interface Bucket {
  timestamps: number[];
}

const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Unique key per caller, e.g. `lead:submit:<ip>`. */
  key: string;
  /** Max requests allowed within the window. */
  limit: number;
  /** Window in milliseconds. */
  windowMs: number;
  /**
   * Whether this call consumes a slot. Pass `false` to only check the
   * bucket (e.g. verify credentials first, charge the attempt only when
   * they fail, so honest mistakes never lock the user out).
   */
  charge?: boolean;
}

export interface RateLimitResult {
  ok: boolean;
  remaining: number;
  retryAfterMs: number;
}

export function rateLimit({
  key,
  limit,
  windowMs,
  charge = true,
}: RateLimitOptions): RateLimitResult {
  const now = Date.now();
  const bucket = buckets.get(key) ?? { timestamps: [] };

  // Keep only requests within the window.
  bucket.timestamps = bucket.timestamps.filter((t) => now - t < windowMs);

  if (bucket.timestamps.length >= limit) {
    const oldest = bucket.timestamps[0] ?? now;
    const retryAfterMs = Math.max(0, windowMs - (now - oldest));
    buckets.set(key, bucket);
    return { ok: false, remaining: 0, retryAfterMs };
  }

  if (charge) bucket.timestamps.push(now);
  buckets.set(key, bucket);
  return { ok: true, remaining: limit - bucket.timestamps.length, retryAfterMs: 0 };
}

/** Test helper: clear the in-memory store. */
export function resetRateLimiter(): void {
  buckets.clear();
}

export function getClientIp(request: Request): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    return xff.split(",")[0]!.trim();
  }
  return request.headers.get("x-real-ip") ?? "unknown";
}
