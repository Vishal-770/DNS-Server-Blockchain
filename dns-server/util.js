import { readContract, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import client from "./client.js";
import { contractAddress } from "./Contract.js";
import {
  buildCacheKey,
  getCachedRecords,
  setCachedRecords,
  CACHE_TTL_SECONDS,
} from "./cache.js";

// Factory contract (manages domain -> domainContract)
const contract = getContract({
  client,
  chain: sepolia,
  address: contractAddress,
});

export default contract;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

async function findDomainTarget(domain) {
  const labels = domain.split(".");

  for (let i = 0; i < labels.length; i++) {
    const candidateLabels = labels.slice(i);
    if (candidateLabels.length === 0) {
      continue;
    }

    const candidate = candidateLabels.join(".");

    if (!candidate.includes(".")) {
      // Ignore bare TLDs when searching for base domain contracts
      continue;
    }

    try {
      const address = await readContract({
        contract,
        method:
          "function getDomainContract(string domainName) view returns (address)",
        params: [candidate],
      });

      if (address && address !== ZERO_ADDRESS) {
        const subdomainLabel = labels.slice(0, i).join(".");
        return {
          contractAddress: address,
          baseDomain: candidate,
          subdomainLabel: subdomainLabel.length ? subdomainLabel : null,
        };
      }
    } catch (lookupError) {
      console.warn(
        `⚠️ Failed domain lookup for ${candidate}: ${lookupError.message}`
      );
    }
  }

  return null;
}

/**
 * Convert DNS type number to string
 * @param {number} typeNum - DNS type number
 * @returns {string} DNS type string
 */
export function getTypeString(typeNum) {
  const types = {
    1: "A",
    2: "NS",
    5: "CNAME",
    15: "MX",
    16: "TXT",
    28: "AAAA",
    33: "SRV",
  };
  return types[typeNum] || "UNKNOWN";
}

/**
 * Validate if a domain name is properly formatted
 * @param {string} domain - The domain name
 * @returns {boolean} Whether the domain is valid
 */
export function isValidDomain(domain) {
  const domainRegex =
    /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain) && domain.length <= 253;
}

function normalizeRecords(typeString, records) {
  if (!Array.isArray(records)) return [];

  if (typeString === "MX") {
    return records.map((mx) => ({
      priority: Number(mx.priority),
      value: mx.value,
    }));
  }

  if (typeString === "SRV") {
    return records.map((srv) => ({
      priority: Number(srv.priority),
      weight: Number(srv.weight),
      port: Number(srv.port),
      target: srv.target,
    }));
  }

  return records;
}

/**
 * Query DNS-like records for a domain
 * @param {string} domain - The domain name (e.g. "wallstreetwheels.store")
 * @param {string} type - Record type (A, AAAA, CNAME, TXT, NS, MX, SRV)
 * @returns {Promise<Array>} Array of DNS records
 */
export async function getDomainIP(domain, type) {
  // Validate input
  if (!domain || !type) {
    throw new Error("Domain and type are required");
  }

  if (!isValidDomain(domain)) {
    throw new Error("Invalid domain format");
  }

  // Convert type number to string if needed
  const typeString =
    typeof type === "number" ? getTypeString(type) : type.toUpperCase();

  if (!["A", "AAAA", "CNAME", "TXT", "NS", "MX", "SRV"].includes(typeString)) {
    throw new Error(`Unsupported record type: ${typeString}`);
  }

  const cacheKey = buildCacheKey(domain, typeString);

  try {
    const cached = await getCachedRecords(cacheKey);
    if (cached) {
      console.log(
        `📦 Cache hit for ${domain} (${typeString}), TTL ${CACHE_TTL_SECONDS}s`
      );
      return JSON.parse(cached);
    }
  } catch (cacheError) {
    console.warn(`⚠️ Redis read failed for ${cacheKey}:`, cacheError.message);
  }

  try {
    // Step 1: Resolve domain contract and subdomain context
    console.log(`Looking up domain contract for: ${domain}`);
    const target = await findDomainTarget(domain);

    if (!target) {
      throw new Error(`Domain not found in blockchain: ${domain}`);
    }

    const {
      contractAddress: resolvedAddress,
      baseDomain,
      subdomainLabel,
    } = target;

    console.log(
      `Found domain contract at: ${resolvedAddress} (base: ${baseDomain}${
        subdomainLabel ? `, subdomain: ${subdomainLabel}` : ""
      })`
    );

    // Step 2: Load domain contract
    const domainContract = getContract({
      client,
      chain: sepolia,
      address: resolvedAddress,
    });

    // Step 3: Handle record type
    let result;

    const isSubdomain = Boolean(subdomainLabel);
    const targetDescriptor = isSubdomain
      ? `${subdomainLabel}.${baseDomain}`
      : baseDomain;

    if (["A", "AAAA", "CNAME", "TXT", "NS"].includes(typeString)) {
      const method = isSubdomain
        ? "function getSubdomainRecord(string label, string recordType) view returns (string[])"
        : "function getRecord(string recordType) view returns (string[])";
      const params = isSubdomain ? [subdomainLabel, typeString] : [typeString];

      console.log(`Fetching ${typeString} records for ${targetDescriptor}`);
      result = await readContract({
        contract: domainContract,
        method,
        params,
      });
    } else if (typeString === "MX") {
      const method = isSubdomain
        ? "function getSubdomainMX(string label) view returns ((uint256 priority, string value)[])"
        : "function getMX() view returns ((uint256 priority, string value)[])";
      const params = isSubdomain ? [subdomainLabel] : [];

      console.log(`Fetching MX records for ${targetDescriptor}`);
      result = await readContract({
        contract: domainContract,
        method,
        params,
      });
    } else if (typeString === "SRV") {
      const method = isSubdomain
        ? "function getSubdomainSRV(string label) view returns ((uint256 priority, uint256 weight, uint256 port, string target)[])"
        : "function getSRV() view returns ((uint256 priority, uint256 weight, uint256 port, string target)[])";
      const params = isSubdomain ? [subdomainLabel] : [];

      console.log(`Fetching SRV records for ${targetDescriptor}`);
      result = await readContract({
        contract: domainContract,
        method,
        params,
      });
    }

    console.log(
      `Retrieved ${
        result?.length || 0
      } record(s) for ${targetDescriptor} (${typeString})`
    );

    const normalized = normalizeRecords(typeString, result || []);

    try {
      await setCachedRecords(cacheKey, JSON.stringify(normalized));
      console.log(
        `📝 Cached ${normalized.length} record(s) for ${domain} (${typeString})`
      );
    } catch (cacheWriteError) {
      console.warn(
        `⚠️ Redis write failed for ${cacheKey}:`,
        cacheWriteError.message
      );
    }

    return normalized;
  } catch (error) {
    console.error(
      `Blockchain query failed for ${domain} (${typeString}):`,
      error.message
    );
    throw error;
  }
}
