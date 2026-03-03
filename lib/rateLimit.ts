interface RateLimitState {
  count: number;
  windowStart: number;
}

export interface RateLimitResult {
  allowed: boolean;
  retryAfterSeconds: number;
}

const store = new Map<string, RateLimitState>();

export function rateLimitByKey(
  key: string,
  limit: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const existing = store.get(key);

  if (!existing || now - existing.windowStart >= windowMs) {
    store.set(key, { count: 1, windowStart: now });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  if (existing.count >= limit) {
    const retryAfterSeconds = Math.max(
      1,
      Math.ceil((windowMs - (now - existing.windowStart)) / 1000)
    );

    return { allowed: false, retryAfterSeconds };
  }

  existing.count += 1;
  store.set(key, existing);

  return { allowed: true, retryAfterSeconds: 0 };
}
