// server.js
import dgram from "dgram";
import dnsPacket from "dns-packet";
import { db } from "./db.js";
import { getDomainIP, getTypeString } from "./util.js";
import {
  consumeRateLimit,
  RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW,
} from "./cache.js";

const server = dgram.createSocket("udp4");
const upstream = { address: "8.8.8.8", port: 53 }; // Fallback DNS (Google)

// Utility: Resolve from blockchain
async function resolveFromBlockchain(name, type) {
  try {
    const typeString = typeof type === "number" ? getTypeString(type) : type;
    console.log(`🔍 Attempting blockchain lookup for ${name} (${typeString})`);

    const blockchainData = await getDomainIP(name, typeString);

    if (!blockchainData || blockchainData.length === 0) {
      console.log(`❌ No blockchain records found for ${name} (${typeString})`);
      return null;
    }

    const answers = [];

    // Handle different record types from blockchain
    switch (typeString) {
      case "A":
        // Handle A records, but also check for CNAME if no A records found
        if (blockchainData.length > 0) {
          blockchainData.forEach((data) => {
            answers.push({
              type: "A",
              name,
              class: "IN",
              ttl: 300,
              data: data,
            });
          });
        } else {
          // No A records found, try CNAME
          try {
            const cnameData = await getDomainIP(name, "CNAME");
            if (cnameData && cnameData.length > 0) {
              // Add CNAME records
              cnameData.forEach((cname) => {
                answers.push({
                  type: "CNAME",
                  name,
                  class: "IN",
                  ttl: 300,
                  data: cname,
                });
              });

              // Try to resolve the CNAME target
              const cnameTarget = cnameData[0];
              const cnameAnswers = await resolveFromBlockchain(
                cnameTarget,
                "A"
              );
              if (cnameAnswers) answers.push(...cnameAnswers);
            }
          } catch (cnameError) {
            console.log(
              `⚠️ CNAME lookup failed for ${name}: ${cnameError.message}`
            );
          }
        }
        break;

      case "AAAA":
      case "NS":
      case "TXT":
        blockchainData.forEach((data) => {
          answers.push({
            type: typeString,
            name,
            class: "IN",
            ttl: 300,
            data: data,
          });
        });
        break;

      case "CNAME":
        blockchainData.forEach((cname) => {
          answers.push({
            type: "CNAME",
            name,
            class: "IN",
            ttl: 300,
            data: cname,
          });
        });

        // Try to follow the CNAME chain in blockchain
        if (type === "A" && blockchainData.length > 0) {
          try {
            const cnameTarget = blockchainData[0];
            const cnameAnswers = await resolveFromBlockchain(cnameTarget, "A");
            if (cnameAnswers) answers.push(...cnameAnswers);
          } catch (err) {
            console.log(
              `⚠️ Failed to follow CNAME ${blockchainData[0]}: ${err.message}`
            );
          }
        }
        break;

      case "MX":
        blockchainData.forEach((mxRecord) => {
          answers.push({
            type: "MX",
            name,
            class: "IN",
            ttl: 300,
            data: {
              preference: Number(mxRecord.priority),
              exchange: mxRecord.value,
            },
          });
        });
        break;

      case "SRV":
        blockchainData.forEach((srvRecord) => {
          answers.push({
            type: "SRV",
            name,
            class: "IN",
            ttl: 300,
            data: {
              priority: Number(srvRecord.priority),
              weight: Number(srvRecord.weight),
              port: Number(srvRecord.port),
              target: srvRecord.target,
            },
          });
        });
        break;

      default:
        console.log(`⚠️ Unsupported record type: ${typeString}`);
        return null;
    }

    console.log(
      `✅ Found ${answers.length} blockchain record(s) for ${name} (${typeString})`
    );
    return answers.length ? answers : null;
  } catch (error) {
    console.log(`❌ Blockchain lookup failed for ${name}: ${error.message}`);
    return null;
  }
}

// Utility: Resolve from local DB
function resolveFromDB(name, type) {
  const answers = [];
  const record = db[name];
  if (!record) return null;

  switch (type) {
    case "A":
      record.A?.forEach((ip) =>
        answers.push({ type: "A", name, class: "IN", ttl: 300, data: ip })
      );
      if (!answers.length && record.CNAME?.length) {
        record.CNAME.forEach((cname) =>
          answers.push({
            type: "CNAME",
            name,
            class: "IN",
            ttl: 300,
            data: cname,
          })
        );
        // Try to follow the CNAME into the DB
        const cnameTarget = record.CNAME[0];
        const extra = resolveFromDB(cnameTarget, "A");
        if (extra) answers.push(...extra);
      }
      break;

    case "AAAA":
      record.AAAA?.forEach((ipv6) =>
        answers.push({ type: "AAAA", name, class: "IN", ttl: 300, data: ipv6 })
      );
      break;

    case "CNAME":
      record.CNAME?.forEach((cname) =>
        answers.push({
          type: "CNAME",
          name,
          class: "IN",
          ttl: 300,
          data: cname,
        })
      );
      break;

    case "MX":
      record.MX?.forEach((mx) =>
        answers.push({
          type: "MX",
          name,
          class: "IN",
          ttl: 300,
          data: { preference: mx.priority, exchange: mx.value },
        })
      );
      break;

    case "NS":
      record.NS?.forEach((ns) =>
        answers.push({ type: "NS", name, class: "IN", ttl: 300, data: ns })
      );
      break;

    case "TXT":
      record.TXT?.forEach((txt) =>
        answers.push({ type: "TXT", name, class: "IN", ttl: 300, data: txt })
      );
      break;

    case "SRV":
      record.SRV?.forEach((srv) =>
        answers.push({
          type: "SRV",
          name,
          class: "IN",
          ttl: 300,
          data: {
            priority: srv.priority,
            weight: srv.weight,
            port: srv.port,
            target: srv.target,
          },
        })
      );
      break;
  }

  return answers.length ? answers : null;
}

server.on("message", async (msg, rinfo) => {
  try {
    const req = dnsPacket.decode(msg);
    const question = req.questions[0]; // handle first question only
    const { name, type } = question;
    const requesterIp = rinfo.address;

    try {
      const rate = await consumeRateLimit(requesterIp);
      if (!rate.allowed) {
        const ttl = rate.ttl >= 0 ? rate.ttl : RATE_LIMIT_WINDOW;
        console.warn(
          `🚫 Rate limit exceeded for ${requesterIp} (${rate.count}/${rate.limit})`
        );

        const response = dnsPacket.encode({
          type: "response",
          id: req.id,
          flags: req.flags,
          questions: req.questions,
          answers: [],
          rcode: "REFUSED",
        });

        server.send(response, rinfo.port, rinfo.address);
        console.log(`⏱️ Rate limited response sent. Retry after ~${ttl}s`);
        return;
      } else if (rate.count === RATE_LIMIT_MAX) {
        console.warn(
          `⚠️ ${requesterIp} is at the rate limit (${RATE_LIMIT_MAX}/${RATE_LIMIT_WINDOW}s)`
        );
      }
    } catch (rateError) {
      console.warn(
        `⚠️ Rate limiting check failed for ${requesterIp}: ${rateError.message}`
      );
    }

    console.log(
      `📥 Query: ${name} (type ${type}) from ${requesterIp}:${rinfo.port}`
    );

    let answers = null;

    // Try blockchain first
    try {
      answers = await resolveFromBlockchain(name, type);
    } catch (blockchainError) {
      console.log(`🔗 Blockchain lookup failed: ${blockchainError.message}`);
    }

    // Fallback to local DB if blockchain fails
    if (!answers) {
      console.log(`📚 Trying local database for ${name}`);
      answers = resolveFromDB(name, type);
      if (answers) {
        console.log(`✅ Found ${answers.length} record(s) in local database`);
      }
    }

    if (answers) {
      // Respond from blockchain or local DB
      const response = dnsPacket.encode({
        type: "response",
        id: req.id,
        flags: dnsPacket.RECURSION_DESIRED | (1 << 10), // Set authoritative answer bit
        questions: req.questions,
        answers,
      });

      server.send(response, rinfo.port, rinfo.address);
      console.log(`📤 Sent ${answers.length} answer(s) for ${name}`);
    } else {
      // Fallback to upstream
      console.log(
        `🔄 Forwarding ${name} (type ${type}) to upstream ${upstream.address}`
      );

      let client;
      try {
        client = dgram.createSocket("udp4");

        // Set up error handling before sending
        client.on("error", (err) => {
          console.error(`❌ Upstream query failed: ${err.message}`);
          if (!client.destroyed) {
            client.close();
          }
        });

        // Timeout handling
        const timeoutId = setTimeout(() => {
          if (!client.destroyed) {
            console.log(`⏰ Upstream query timeout for ${name}`);
            client.close();
          }
        }, 5000);

        client.on("message", (upstreamRes) => {
          if (!client.destroyed) {
            server.send(upstreamRes, rinfo.port, rinfo.address);
            console.log(`📤 Forwarded response for ${name} from upstream`);
            client.close();
          }
        });

        // Clear timeout if client closes normally
        client.on("close", () => {
          clearTimeout(timeoutId);
        });

        // Send the query
        client.send(msg, upstream.port, upstream.address);
      } catch (err) {
        console.error(`❌ Error creating upstream client: ${err.message}`);
        if (client && !client.destroyed) {
          client.close();
        }
      }
    }
  } catch (err) {
    console.error("❌ Error processing DNS query:", err);
  }
});

server.bind(53, async () => {
  console.log("🚀 DNS Server is running on port 53");
  console.log("🔗 Testing blockchain connectivity...");

  try {
    const testData = await getDomainIP("wallstreetwheels.store", "A");
    console.log("✅ Blockchain connection successful!");
    console.log("🧪 Test data:", testData);
  } catch (error) {
    console.log("⚠️ Blockchain connection failed:", error.message);
    console.log("📚 Will fallback to local database and upstream DNS");
  }

  console.log("📡 Ready to handle DNS queries!");
});

// Handle server errors
server.on("error", (err) => {
  console.error("❌ DNS Server error:", err);
  if (err.code === "EADDRINUSE") {
    console.log(
      "🔧 Port 53 is already in use. Try running with administrator/sudo privileges."
    );
  }
});

// Graceful shutdown handling
process.on("SIGINT", () => {
  console.log("\n⏹️ Received SIGINT, shutting down gracefully...");
  server.close(() => {
    console.log("✅ DNS Server stopped successfully");
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  console.log("\n⏹️ Received SIGTERM, shutting down gracefully...");
  server.close(() => {
    console.log("✅ DNS Server stopped successfully");
    process.exit(0);
  });
});

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  server.close(() => {
    process.exit(1);
  });
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  server.close(() => {
    process.exit(1);
  });
});
