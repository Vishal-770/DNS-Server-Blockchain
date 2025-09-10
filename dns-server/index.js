// server.js
import dgram from "dgram";
import dnsPacket from "dns-packet";
import { db } from "./db.js";
import { getDomainIP, getTypeString } from "./util.js";

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

    console.log(
      `📥 Query: ${name} (type ${type}) from ${rinfo.address}:${rinfo.port}`
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
      const client = dgram.createSocket("udp4");

      client.send(msg, upstream.port, upstream.address);

      client.on("message", (upstreamRes) => {
        server.send(upstreamRes, rinfo.port, rinfo.address);
        console.log(`📤 Forwarded response for ${name} from upstream`);
        client.close();
      });

      client.on("error", (err) => {
        console.error(`❌ Upstream query failed: ${err.message}`);
        client.close();
      });

      // Timeout handling
      setTimeout(() => {
        client.close();
        console.log(`⏰ Upstream query timeout for ${name}`);
      }, 5000);
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
