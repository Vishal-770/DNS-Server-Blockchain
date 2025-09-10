// db.js
export const db = {
  "wallstreetwheels.store": {
    A: ["192.168.1.100"], // IPv4
    AAAA: ["2600:1406:5e00::1"], // IPv6
    CNAME: ["wallstreetwheels.store"],
    NS: ["ns1.wallstreetwheels.store", "ns2.wallstreetwheels.store"],
    MX: [
      { priority: 10, value: "mail.wallstreetwheels.store" },
      { priority: 20, value: "backupmail.wallstreetwheels.store" },
    ],
    TXT: [
      "v=spf1 include:_spf.google.com ~all",
      "google-site-verification=abc123",
    ],
  },

  "shop.wallstreetwheels.store": {
    CNAME: ["wallstreetwheels.store"],
  },

  "mail.wallstreetwheels.store": {
    A: ["192.168.1.101"],
  },

  "backupmail.wallstreetwheels.store": {
    A: ["192.168.1.102"],
  },

  "ns1.wallstreetwheels.store": {
    A: ["192.168.1.200"],
  },

  "ns2.wallstreetwheels.store": {
    A: ["192.168.1.201"],
  },

  "_sip._tcp.wallstreetwheels.store": {
    SRV: [
      {
        priority: 10,
        weight: 60,
        port: 5060,
        target: "sip1.wallstreetwheels.store",
      },
      {
        priority: 20,
        weight: 20,
        port: 5060,
        target: "sip2.wallstreetwheels.store",
      },
    ],
  },
};
