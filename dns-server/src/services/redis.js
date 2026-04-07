import { createClient } from "redis";
import config from "../config/index.js";

const client = createClient(config.redis);

client.on("error", (err) => {
  console.error("❌ Redis Client Error:", err.message);
});

let isConnected = false;
let connectPromise = null;

/**
 * Ensures the Redis client is connected
 */
async function ensureConnected() {
  if (isConnected) return true;
  if (connectPromise) return connectPromise;

  connectPromise = client.connect()
    .then(() => {
      isConnected = true;
      connectPromise = null;
      console.log("✅ Successfully connected to Redis");
      return true;
    })
    .catch((err) => {
      isConnected = false;
      connectPromise = null;
      console.warn(`⚠️ Redis Connection Failed: ${err.message}`);
      return false;
    });

  return connectPromise;
}

/**
 * Cache Strategy
 */
export async function getCache(key) {
  try {
    if (!(await ensureConnected())) return null;
    const value = await client.get(key);
    if (value) {
      console.log(`[REDIS] 📥 Cache HIT: ${key}`);
    } else {
      console.log(`[REDIS] 🔍 Cache MISS: ${key}`);
    }
    return value;
  } catch (err) {
    console.warn(`[REDIS] ⚠️ Cache read failed: ${key}`, err.message);
    return null;
  }
}

export async function setCache(key, value, ttl = config.cache.ttl) {
  try {
    if (!(await ensureConnected())) return;
    if (typeof value === "undefined") return;
    
    await client.set(key, value, { EX: ttl });
    console.log(`[REDIS] 📤 Cache SET: ${key} (TTL: ${ttl}s)`);
  } catch (err) {
    console.warn(`[REDIS] ⚠️ Cache write failed: ${key}`, err.message);
  }
}

/**
 * Rate Limiting Logic (Atomic Lua Script)
 */
const RATE_LIMIT_SCRIPT = `
local key = KEYS[1]
local limit = tonumber(ARGV[1])
local window = tonumber(ARGV[2])

local current = redis.call("INCR", key)
if current == 1 then
    redis.call("EXPIRE", key, window)
end
local ttl = redis.call("TTL", key)
return { current, ttl }
`;

export async function checkRateLimit(identifier) {
  try {
    if (!(await ensureConnected())) {
      // In production, if Redis is down, we might allow the request? 
      // Depends on security posture. Here we fail-safe (allow).
      return { allowed: true, count: 0, ttl: 0 }; 
    }

    const key = `rate:${identifier}`;
    const result = await client.eval(RATE_LIMIT_SCRIPT, {
      keys: [key],
      arguments: [
        config.rateLimit.max.toString(),
        config.rateLimit.window.toString()
      ]
    });

    const [count, ttl] = result;

    return {
      allowed: count <= config.rateLimit.max,
      count,
      ttl: ttl > 0 ? ttl : config.rateLimit.window,
      limit: config.rateLimit.max,
    };
  } catch (err) {
    console.warn(`⚠️ Rate limiting script failed for ${identifier}:`, err.message);
    return { allowed: true, count: 0, ttl: 0 }; // Fail-safe: allow
  }
}

export function buildCacheKey(domain, type) {
  return `dns:${type}:${domain}`.toLowerCase();
}

export async function shutdown() {
  if (isConnected) {
    await client.quit();
    isConnected = false;
    console.log("🔌 Redis connection closed");
  }
}

export default {
  get: getCache,
  set: setCache,
  checkRateLimit,
  buildCacheKey,
  shutdown
};
