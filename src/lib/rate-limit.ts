const attempts = new Map<string, number[]>();

/** In-memory sliding-window rate limiter. Returns true if the call is allowed. */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const timestamps = (attempts.get(key) ?? []).filter((t) => now - t < windowMs);

  if (timestamps.length >= limit) {
    attempts.set(key, timestamps);
    return false;
  }

  timestamps.push(now);
  attempts.set(key, timestamps);
  return true;
}
