import dotenv from "dotenv";
dotenv.config();

/**
 * Global Configuration for the DNS Server
 */
const {
  REDIS_HOST,
  REDIS_PORT,
  REDIS_USERNAME,
  REDIS_PASSWORD,
  REDIS_CACHE_TTL,
  RATE_LIMIT_MAX_REQUESTS,
  RATE_LIMIT_WINDOW_SECONDS,
  THIRD_WEB_CLIENT_ID,
  THIRD_WEB_KEY,
  UPSTREAM_DNS_IP,
  UPSTREAM_DNS_PORT,
  DNS_PORT,
} = process.env;

export const config = {
  // Thirdweb
  thirdweb: {
    clientId: THIRD_WEB_CLIENT_ID,
    secretKey: THIRD_WEB_KEY,
  },

  // Network
  port: Number(DNS_PORT) || 53,
  upstream: {
    address: UPSTREAM_DNS_IP || "8.8.8.8",
    port: Number(UPSTREAM_DNS_PORT) || 53,
  },

  // Redis
  redis: {
    username: REDIS_USERNAME || "default",
    password: REDIS_PASSWORD,
    socket: {
      host: REDIS_HOST || "localhost",
      port: Number(REDIS_PORT) || 6379,
    },
  },

  // Persistence
  cache: {
    ttl: Number(REDIS_CACHE_TTL) || 300, // Increased default for production
  },

  // Security
  rateLimit: {
    max: Number(RATE_LIMIT_MAX_REQUESTS) || 20,
    window: Number(RATE_LIMIT_WINDOW_SECONDS) || 60,
  },

  // Constants
  ZERO_ADDRESS: "0x0000000000000000000000000000000000000000",
};

export default config;
