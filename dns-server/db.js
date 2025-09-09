export const db = {
  "wallstreetwheels.store": {
    A: ["192.168.1.100"], // IPv4 addresses
    AAAA: ["2600:1406:5e00::1"], // IPv6 addresses
    CNAME: [], // Usually empty unless this domain is an alias
    MX: [{ priority: 10, value: "mail.wallstreetwheels.store" }],
    TXT: ["v=spf1 include:_spf.google.com ~all"],
  },

  "shop.wallstreetwheels.store": {
    CNAME: ["wallstreetwheels.store"], // Alias to main domain
  },

  "mail.wallstreetwheels.store": {
    A: ["192.168.1.101"],
  },
};
