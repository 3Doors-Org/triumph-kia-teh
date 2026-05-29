import { createHash } from "node:crypto";

import { Redis } from "@upstash/redis";

function getRedisClient() {
  if (process.env.NODE_ENV === "test") {
    return null;
  }
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) {
    return null;
  }
  return new Redis({ url, token });
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export async function blocklistSessionToken(rawToken: string, ttlSeconds: number = 60 * 60 * 8) {
  const redis = getRedisClient();
  if (!redis || rawToken.trim().length === 0) {
    return;
  }

  const key = `auth:blocklist:${hashToken(rawToken)}`;
  await redis.set(key, "1", { ex: ttlSeconds });
}
