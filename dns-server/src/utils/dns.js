/**
 * DNS Utility Library
 */

export const DNS_TYPES = {
  1: "A",
  2: "NS",
  5: "CNAME",
  6: "SOA",
  12: "PTR",
  15: "MX",
  16: "TXT",
  28: "AAAA",
  33: "SRV",
  64: "SVCB",
  65: "HTTPS",
};

/**
 * Convert DNS type number to readable string or return numeric string if unknown
 */
export function getTypeString(typeNum) {
  return DNS_TYPES[typeNum] || `${typeNum}`;
}

/**
 * Domain name validation
 */
export function isValidDomain(domain) {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain) && domain.length <= 253;
}

/**
 * Record Formatting
 */
export function formatAnswer(name, type, data, ttl = 300) {
  const typeString = typeof type === "number" ? getTypeString(type) : type.toUpperCase();

  const base = {
    name,
    type: typeString,
    class: "IN",
    ttl,
  };

  switch (typeString) {
    case "A":
    case "AAAA":
    case "NS":
    case "TXT":
    case "CNAME":
      return { ...base, data };
    case "MX":
      return {
        ...base,
        data: {
          preference: data.priority,
          exchange: data.value,
        },
      };
    case "SRV":
      return {
        ...base,
        data: {
          priority: data.priority,
          weight: data.weight,
          port: data.port,
          target: data.target,
        },
      };
    default:
      return null;
  }
}

export default {
  DNS_TYPES,
  getTypeString,
  isValidDomain,
  formatAnswer,
};
