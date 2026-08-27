/**
 * In-Memory Security Rate Limiter for API Routes
 * Protects endpoints from DDoS, brute-force, and spam attacks.
 */

interface RateLimitStore {
  [ip: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

/**
 * Checks if a given IP address exceeds the allowed limit.
 * @param ip Client IP address or identifier
 * @param limit Maximum allowed requests per window
 * @param windowMs Time window in milliseconds (default: 60 seconds)
 */
export function checkRateLimit(ip: string, limit = 15, windowMs = 60 * 1000): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const record = store[ip];

  if (!record || now > record.resetTime) {
    store[ip] = {
      count: 1,
      resetTime: now + windowMs,
    };
    return { allowed: true, remaining: limit - 1 };
  }

  if (record.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  record.count += 1;
  return { allowed: true, remaining: limit - record.count };
}

/**
 * Sanitizes input strings to strip dangerous HTML / script tags.
 */
export function sanitizeInput(input: string, maxLength = 2000): string {
  if (typeof input !== 'string') return '';
  return input
    .trim()
    .slice(0, maxLength)
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}
