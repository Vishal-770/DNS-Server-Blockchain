import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_CACHE_TTL,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_SECONDS,
} = process.env;

const ttlSeconds = Number(REDIS_CACHE_TTL) || 60;
const rateLimitMaxRequests = Number(RATE_LIMIT_MAX_REQUESTS) || 10;
const rateLimitWindowSeconds = Number(RATE_LIMIT_WINDOW_SECONDS) || 60;

const client = createClient({
  username: REDIS_USERNAME || "default",
  password: REDIS_PASSWORD,
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT ? Number(REDIS_PORT) : 6379,
  },
});

client.on("error", (err) => {
  console.error("Redis Client Error", err);
});

let connectPromise;

async function ensureConnected() {
  if (!connectPromise) {
    connectPromise = client.connect().catch((err) => {
      connectPromise = undefined;
      throw err;
    });
  }

  return connectPromise;
}

export async function getCachedRecords(key) {
  await ensureConnected();
  return client.get(key);
}

export async function setCachedRecords(key, value, ttl = ttlSeconds) {
  await ensureConnected();
  if (typeof value === "undefined") return;
  await client.set(key, value, {
    EX: ttl,
  });
}

export function buildCacheKey(domain, type) {
  return `dns:${type}:${domain}`.toLowerCase();
}

export const CACHE_TTL_SECONDS = ttlSeconds;
export const RATE_LIMIT_MAX = rateLimitMaxRequests;
export const RATE_LIMIT_WINDOW = rateLimitWindowSeconds;

export async function consumeRateLimit(identifier) {
  await ensureConnected();

  const key = `rate:${identifier}`;
  const count = await client.incr(key);

  if (count === 1) {
    await client.expire(key, rateLimitWindowSeconds);
  }

  let ttl = await client.ttl(key);
  if (ttl < 0) {
    await client.expire(key, rateLimitWindowSeconds);
    ttl = rateLimitWindowSeconds;
  }

  return {
    allowed: count <= rateLimitMaxRequests,
    count,
    ttl,
    limit: rateLimitMaxRequests,
    window: rateLimitWindowSeconds,
  };
}
