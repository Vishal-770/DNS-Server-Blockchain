import dgram from "dgram";
import dnsPacket from "dns-packet";
import config from "../config/index.js";
import redis from "../services/redis.js";
import blockchain from "../services/blockchain.js";
import dnsUtils from "../utils/dns.js";

const server = dgram.createSocket("udp4");

/**
 * Standardized Logger helper
 */
const logger = {
  info: (msg) => console.log(`[DNS] [INFO] ${new Date().toLocaleTimeString()} - ${msg}`),
  warn: (msg) => console.log(`[DNS] [WARN] ${new Date().toLocaleTimeString()} - ${msg}`),
  error: (msg) => console.log(`[DNS] [ERROR] ${new Date().toLocaleTimeString()} - ${msg}`),
};

/**
 * Main DNS Query Handler
 */
async function handleQuery(msg, rinfo) {
  const req = dnsPacket.decode(msg);
  const question = req.questions[0];
  const { name, type } = question;
  const requestId = req.id;
  const requesterIp = rinfo.address;
  // Sanitize name: remove trailing dot and convert to lowercase
  const sanitizedName = name.endsWith(".") ? name.slice(0, -1).toLowerCase() : name.toLowerCase();
  const typeString = dnsUtils.getTypeString(type);
  const cacheKey = redis.buildCacheKey(sanitizedName, typeString);

  // 1. Rate Limiting
  const rateLimit = await redis.checkRateLimit(requesterIp);
  if (!rateLimit.allowed) {
    logger.warn(`🚫 Rate limit exceeded: ${requesterIp} (${rateLimit.count}/${rateLimit.limit})`);
    sendErrorResponse(requestId, req, "REFUSED", rinfo);
    return;
  }

  logger.info(`📥 QUERY: ${name} (${typeString}) [FROM: ${requesterIp}]`);

  // 2. Resolution Strategy
  try {
    // A. Check Global Cache
    const cachedAnswers = await redis.get(cacheKey);
    if (cachedAnswers) {
      const answers = JSON.parse(cachedAnswers);
      logger.info(`✅ [CACHE_HIT] ${sanitizedName} -> ${answers.length} records`);
      sendSuccessResponse(requestId, req, answers, rinfo, true);
      return;
    }

    // B. Resolve from Blockchain
    const blockchainRecords = await blockchain.resolveBlockchainRecords(sanitizedName, typeString);
    if (blockchainRecords && blockchainRecords.length > 0) {
      const answers = blockchainRecords.map(r => dnsUtils.formatAnswer(sanitizedName, typeString, r));
      logger.info(`🌐 [BLOCKCHAIN] ${sanitizedName} -> ${answers.length} records found`);
      // Update Cache (it's actually handled inside blockchain.resolveBlockchainRecords, but let's be explicit if needed)
      await redis.set(cacheKey, JSON.stringify(answers));
      sendSuccessResponse(requestId, req, answers, rinfo);
      return;
    }

    // C. Resolve from Upstream (Google DNS)
    logger.info(`🔄 [UPSTREAM] ${sanitizedName} -> Forwarding to ${config.upstream.address}`);
    await resolveAndCacheUpstream(msg, rinfo, sanitizedName, typeString, cacheKey);

  } catch (err) {
    logger.error(`❌ Resolution failed for ${name}: ${err.message}`);
    sendErrorResponse(requestId, req, "SERVFAIL", rinfo);
  }
}

/**
 * Resolve from Upstream, Cache results, and then respond to client
 */
async function resolveAndCacheUpstream(msg, rinfo, name, typeString, cacheKey) {
  const client = dgram.createSocket("udp4");
  const requestId = dnsPacket.decode(msg).id;

  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      if (!client.destroyed) {
        client.close();
        logger.warn(`⏳ [UPSTREAM_TIMEOUT] ${name}`);
        resolve();
      }
    }, 4000);

    client.on("message", async (upstreamRes) => {
      clearTimeout(timeout);
      const decodedRes = dnsPacket.decode(upstreamRes);
      
      // Send response back to user immediately for speed
      // Ensure the ID matches the user's request, not the potentially new upstream ID if rewritten
      decodedRes.id = requestId;
      const respBuffer = dnsPacket.encode(decodedRes);
      server.send(respBuffer, rinfo.port, rinfo.address);

      // Cache the result if there are answers
      if (decodedRes.answers && decodedRes.answers.length > 0) {
        logger.info(`✅ [UPSTREAM_SUCCESS] ${name} resolved via ${config.upstream.address}`);
        await redis.set(cacheKey, JSON.stringify(decodedRes.answers));
      } else {
        logger.warn(`❓ [UPSTREAM_EMPTY] ${name} has no records`);
      }

      client.close();
      resolve();
    });

    client.on("error", (err) => {
      clearTimeout(timeout);
      logger.error(`❌ [UPSTREAM_ERROR] ${err.message}`);
      client.close();
      resolve();
    });

    client.send(msg, config.upstream.port, config.upstream.address);
  });
}

function sendSuccessResponse(id, req, answers, rinfo, fromCache = false) {
  const resp = dnsPacket.encode({
    type: "response",
    id: id,
    flags: (fromCache ? 0 : (1 << 10)) | dnsPacket.RECURSION_AVAILABLE, // Authoritative bit if not from cache
    questions: req.questions,
    answers,
  });
  server.send(resp, rinfo.port, rinfo.address);
}

function sendErrorResponse(id, req, rcode, rinfo) {
  const resp = dnsPacket.encode({
    type: "response",
    id: id,
    flags: req.flags,
    questions: req.questions,
    answers: [],
    rcode: rcode,
  });
  server.send(resp, rinfo.port, rinfo.address);
}

/**
 * Server Lifecycle Management
 */
export function start() {
  server.on("message", handleQuery);
  
  server.on("error", (err) => {
    logger.error(`🔥 Server socket error: ${err.message}`);
  });

  server.bind(config.port, () => {
    console.log(`\n================================================`);
    console.log(`🚀 BLOCKCHAIN DNS SERVER IS LIVE ON PORT ${config.port}`);
    console.log(`🔗 UPSTREAM RESOLVER: ${config.upstream.address}:${config.upstream.port}`);
    console.log(`🧰 REDIS CACHING: ENABLED`);
    console.log(`📅 STARTED: ${new Date().toLocaleString()}`);
    console.log(`================================================\n`);
  });
}

export async function stop() {
  logger.info("⏹️ Shutting down server...");
  server.close();
  await redis.shutdown();
}

export default { start, stop };
