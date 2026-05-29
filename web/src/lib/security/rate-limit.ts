import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let limiter: Ratelimit | null = null;
let publicReadLimiter: Ratelimit | null = null;
let authLoginLimiter: Ratelimit | null = null;

function getLimiter() {
  if (limiter) {
    return limiter;
  }
  if (process.env.NODE_ENV === "test") {
    return null;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }

  limiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "1 h"),
    prefix: "contact-form",
    analytics: true,
  });

  return limiter;
}

function getPublicReadLimiter() {
  if (publicReadLimiter) {
    return publicReadLimiter;
  }
  if (process.env.NODE_ENV === "test") {
    return null;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }

  publicReadLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(60, "1 m"),
    prefix: "public-api-get",
    analytics: true,
  });

  return publicReadLimiter;
}

function getAuthLoginLimiter() {
  if (authLoginLimiter) {
    return authLoginLimiter;
  }
  if (process.env.NODE_ENV === "test") {
    return null;
  }

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }

  authLoginLimiter = new Ratelimit({
    redis: new Redis({ url, token }),
    limiter: Ratelimit.slidingWindow(5, "15 m"),
    prefix: "auth-login",
    analytics: true,
  });

  return authLoginLimiter;
}

export async function enforceContactRateLimit(identifier: string) {
  const activeLimiter = getLimiter();
  if (!activeLimiter) {
    return null;
  }

  return activeLimiter.limit(identifier);
}

export async function enforcePublicReadRateLimit(identifier: string) {
  const activeLimiter = getPublicReadLimiter();
  if (!activeLimiter) {
    return null;
  }

  return activeLimiter.limit(identifier);
}

export async function enforceAuthLoginRateLimit(identifier: string) {
  const activeLimiter = getAuthLoginLimiter();
  if (!activeLimiter) {
    return null;
  }

  return activeLimiter.limit(identifier);
}
