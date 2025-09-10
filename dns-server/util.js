import { readContract, getContract } from "thirdweb";
import { sepolia } from "thirdweb/chains";
import client from "./client.js";
import { contractAddress } from "./Contract.js";

// Factory contract (manages domain -> domainContract)
const contract = getContract({
  client,
  chain: sepolia,
  address: contractAddress,
});

export default contract;

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

  try {
    // Step 1: Look up domain contract from factory
    console.log(`Looking up domain contract for: ${domain}`);
    const data = await readContract({
      contract,
      method:
        "function getDomainContract(string domainName) view returns (address)",
      params: [domain],
    });

    if (!data || data === "0x0000000000000000000000000000000000000000") {
      throw new Error(`Domain not found in blockchain: ${domain}`);
    }

    console.log(`Found domain contract at: ${data}`);

    // Step 2: Load domain contract
    const domainContract = getContract({
      client,
      chain: sepolia,
      address: data,
    });

    // Step 3: Handle record type
    let result;

    if (["A", "AAAA", "CNAME", "TXT", "NS"].includes(typeString)) {
      // Simple string[] record
      console.log(`Fetching ${typeString} records for ${domain}`);
      result = await readContract({
        contract: domainContract,
        method: "function getRecord(string recordType) view returns (string[])",
        params: [typeString],
      });
    } else if (typeString === "MX") {
      // MX record → array of (priority, value)
      console.log(`Fetching MX records for ${domain}`);
      result = await readContract({
        contract: domainContract,
        method:
          "function getMX() view returns ((uint256 priority, string value)[])",
        params: [],
      });
    } else if (typeString === "SRV") {
      // SRV record → array of (priority, weight, port, target)
      console.log(`Fetching SRV records for ${domain}`);
      result = await readContract({
        contract: domainContract,
        method:
          "function getSRV() view returns ((uint256 priority, uint256 weight, uint256 port, string target)[])",
        params: [],
      });
    }

    console.log(
      `Retrieved ${result?.length || 0} records for ${domain} (${typeString})`
    );
    return result || [];
  } catch (error) {
    console.error(
      `Blockchain query failed for ${domain} (${typeString}):`,
      error.message
    );
    throw error;
  }
}
