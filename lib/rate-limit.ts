/**
 * Lightweight in-memory rate limiter.
 *
 * No external dependencies. Uses a sliding-window counter per key.
 * Suitable for single-instance deployments. For multi-instance deployments,
 * replace with Redis-backed rate limiting.
 *
 * Server-only — never import in client components.
 */

interface RateLimitEntry {
  count: number;
  windowStart: number;
}

const store = new Map<string, RateLimitEntry>();

// Clean up expired entries periodically to prevent memory leaks.
const CLEANUP_INTERVAL_MS = 60_000; // 1 minute
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  for (const [key, entry] of store) {
    if (now - entry.windowStart > 300_000) {
      // 5 min max window — safe to discard
      store.delete(key);
    }
  }
}

export interface RateLimitConfig {
  /** Unique namespace for this limiter (e.g. "response-submit") */
  namespace: string;
  /** Maximum requests allowed in the window */
  maxRequests: number;
  /** Window duration in milliseconds (default: 60 000 = 1 minute) */
  windowMs?: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterMs: number;
}

/**
 * Check rate limit for a given key.
 * Returns whether the request is allowed and metadata.
 */
export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  cleanup();

  const now = Date.now();
  const windowMs = config.windowMs ?? 60_000;
  const compositeKey = `${config.namespace}:${key}`;

  const entry = store.get(compositeKey);

  if (!entry || now - entry.windowStart >= windowMs) {
    // New window
    store.set(compositeKey, { count: 1, windowStart: now });
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      retryAfterMs: 0,
    };
  }

  // Within current window
  entry.count++;

  if (entry.count > config.maxRequests) {
    const retryAfterMs = windowMs - (now - entry.windowStart);
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs,
    };
  }

  return {
    allowed: true,
    remaining: config.maxRequests - entry.count,
    retryAfterMs: 0,
  };
}

/**
 * Get client IP from request headers.
 * Falls back to "unknown" if no IP is found.
 */
export function getClientIp(request: Request): string {
  // Vercel / common proxies
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp;

  return "unknown";
}
