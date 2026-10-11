export const MAX_MESSAGE_LENGTH = 1000;
export const MAX_HISTORY = 6;
export const RATE_LIMIT = 20; // aanroepen per uur per gebruiker/IP
export const RATE_WINDOW_MS = 60 * 60 * 1000;

/** Eenvoudige teller per sleutel. In-memory: per serverinstantie, bedoeld als eerste vangnet. */
export function createRateLimiter({
  limit = RATE_LIMIT,
  windowMs = RATE_WINDOW_MS,
  now = () => Date.now(),
}: { limit?: number; windowMs?: number; now?: () => number } = {}) {
  const hits = new Map<string, number[]>();
  return {
    check(key: string): { ok: true } | { ok: false; retryAfterSec: number } {
      const t = now();
      const recent = (hits.get(key) ?? []).filter((x) => t - x < windowMs);
      if (recent.length >= limit) {
        hits.set(key, recent);
        return { ok: false, retryAfterSec: Math.ceil((windowMs - (t - recent[0]!)) / 1000) };
      }
      recent.push(t);
      hits.set(key, recent);
      return { ok: true };
    },
  };
}

export function clampMessage(text: string) {
  return text.trim().slice(0, MAX_MESSAGE_LENGTH);
}
