import { readContract, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import client from "../config/client.js";
import bcConfig from "../config/blockchain.js";
import redis from "./redis.js";

/**
 * Main Web3 Factory Contract
 */
const factoryContract = getContract({
  client,
  chain: sepolia,
  address: bcConfig.CONTRACT_ADDRESS,
});

/**
 * Find the contract address for a given domain/subdomain
 */
export async function findDomainTarget(domain) {
  const labels = domain.split(".");

  for (let i = 0; i < labels.length; i++) {
    const candidateLabels = labels.slice(i);
    if (candidateLabels.length < 2) continue; // Ignore bare TLDs

    const candidate = candidateLabels.join(".");

    try {
      const address = await readContract({
        contract: factoryContract,
        method: "function getDomainContract(string domainName) view returns (address)",
        params: [candidate],
      });

      if (address && address !== bcConfig.ZERO_ADDRESS) {
        const subdomainLabel = labels.slice(0, i).join(".");
        return {
          contractAddress: address,
          baseDomain: candidate,
          subdomainLabel: subdomainLabel.length ? subdomainLabel : null,
        };
      }
    } catch (err) {
      console.warn(`⚠️ Blockchain lookup failed for ${candidate}:`, err.message);
    }
  }

  return null;
}

/**
 * Resolve specific record type from blockchain with caching
 */
export async function resolveBlockchainRecords(domain, typeString) {
  const cacheKey = redis.buildCacheKey(domain, typeString);

  // 1. Try Cache
  const cached = await redis.get(cacheKey);
  if (cached) {
    console.log(`📦 Cache hit for ${domain} (${typeString})`);
    return JSON.parse(cached);
  }

  // 2. Resolve Domain Contract
  const target = await findDomainTarget(domain);
  if (!target) return null;

  const { contractAddress: address, subdomainLabel } = target;

  const domainContract = getContract({
    client,
    chain: sepolia,
    address,
  });

  const isSubdomain = Boolean(subdomainLabel);
  let result = [];

  // 3. Chain Lookup
  try {
    if (["A", "AAAA", "CNAME", "TXT", "NS"].includes(typeString)) {
      result = await readContract({
        contract: domainContract,
        method: isSubdomain 
          ? "function getSubdomainRecord(string label, string recordType) view returns (string[])"
          : "function getRecord(string recordType) view returns (string[])" ,
        params: isSubdomain ? [subdomainLabel, typeString] : [typeString],
      });
    } else if (typeString === "MX") {
      result = await readContract({
        contract: domainContract,
        method: isSubdomain 
          ? "function getSubdomainMX(string label) view returns ((uint256, string)[])"
          : "function getMX() view returns ((uint256, string)[])",
        params: isSubdomain ? [subdomainLabel] : [],
      });
      result = result.map(m => ({ priority: Number(m[0]), value: m[1] }));
    } else if (typeString === "SRV") {
      result = await readContract({
        contract: domainContract,
        method: isSubdomain 
          ? "function getSubdomainSRV(string label) view returns ((uint256, uint256, uint256, string)[])"
          : "function getSRV() view returns ((uint256, uint256, uint256, string)[])",
        params: isSubdomain ? [subdomainLabel] : [],
      });
      result = result.map(s => ({
        priority: Number(s[0]),
        weight: Number(s[1]),
        port: Number(s[2]),
        target: s[3],
      }));
    }

    // 4. Update Cache
    if (result && result.length > 0) {
      await redis.set(cacheKey, JSON.stringify(result));
    }

    return result;
  } catch (err) {
    console.error(`❌ Blockchain resolve failed for ${domain} (${typeString}):`, err.message);
    return null;
  }
}

export default {
  findDomainTarget,
  resolveBlockchainRecords
};
