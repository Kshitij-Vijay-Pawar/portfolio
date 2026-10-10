/**
 * In-memory sliding-window IP rate limiter.
 *
 * ARCHITECTURAL NOTICE FOR SERVERLESS HOSTING:
 * In-memory rate limiting operates per Node/Edge process instance. It serves as a
 * resilient local safeguard in local dev and single-instance containers.
 * In distributed serverless deployments (such as Vercel Edge / Serverless functions),
 * instances are ephemeral and memory is not shared across regions. For strict global
 * multi-instance guarantees, utilize Upstash Redis or rely on Google AI Studio
 * provider-level quota caps.
 */

interface RateLimitRecord {
  timestamps: number[];
}

const rateLimitMap = new Map<string, RateLimitRecord>();

const WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 15; // 15 requests per minute

/**
 * Checks if a given IP address exceeds the allowed rate limit.
 * Automatically cleans up expired timestamps.
 */
export function checkRateLimit(ip: string): {
  allowed: boolean;
  remaining: number;
  resetMs: number;
} {
  const now = Date.now();
  const record = rateLimitMap.get(ip) || { timestamps: [] };

  // Filter out timestamps outside the active window
  const validTimestamps = record.timestamps.filter((t) => now - t < WINDOW_MS);

  if (validTimestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    const oldestTimestamp = validTimestamps[0];
    const resetMs = WINDOW_MS - (now - oldestTimestamp);

    return {
      allowed: false,
      remaining: 0,
      resetMs: Math.max(0, resetMs),
    };
  }

  validTimestamps.push(now);
  rateLimitMap.set(ip, { timestamps: validTimestamps });

  // Prevent memory leaks: prune expired keys if map grows large
  if (rateLimitMap.size > 1000) {
    for (const [key, val] of rateLimitMap.entries()) {
      const active = val.timestamps.filter((t) => now - t < WINDOW_MS);
      if (active.length === 0) {
        rateLimitMap.delete(key);
      } else {
        rateLimitMap.set(key, { timestamps: active });
      }
    }
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS_PER_WINDOW - validTimestamps.length,
    resetMs: WINDOW_MS,
  };
}

/**
 * Extracts client IP from standard reverse-proxy headers.
 */
export function getClientIp(req: Request): string {
  const xForwardedFor = req.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }

  const xRealIp = req.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp.trim();
  }

  return "127.0.0.1";
}
