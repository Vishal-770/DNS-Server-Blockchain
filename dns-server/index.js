// server.js
import dgram from "dgram";
import dnsPacket from "dns-packet";
import { db } from "./db.js"; // Your DNS database

const server = dgram.createSocket("udp4");

server.on("message", (msg, rinfo) => {
  try {
    const req = dnsPacket.decode(msg);
    const question = req.questions[0]; // Handle first question only
    const name = question.name;
    const type = question.type;

    console.log(`Received query for ${name} (type ${type}) from ${rinfo.address}:${rinfo.port}`);

    const answers = [];

    if (db[name]) {
      const record = db[name];

      if (type === "A" && record.A?.length) {
        // A record exists
        record.A.forEach(ip => {
          answers.push({
            type: "A",
            name,
            class: "IN",
            ttl: 300,
            data: ip
          });
        });
      } else if (type === "A" && record.CNAME?.length) {
        // A requested but only CNAME exists
        record.CNAME.forEach(cname => {
          answers.push({
            type: "CNAME",
            name,
            class: "IN",
            ttl: 300,
            data: cname
          });
        });
      } else if (type === "CNAME" && record.CNAME?.length) {
        // CNAME requested
        record.CNAME.forEach(cname => {
          answers.push({
            type: "CNAME",
            name,
            class: "IN",
            ttl: 300,
            data: cname
          });
        });
      }
    }

    // Encode and send response
    const response = dnsPacket.encode({
      type: "response",
      id: req.id,
      flags: dnsPacket.RECURSION_DESIRED,
      questions: req.questions,
      answers
    });

    server.send(response, rinfo.port, rinfo.address);
  } catch (err) {
    console.error("Error processing DNS query:", err);
  }
});

server.bind(53, () => console.log("DNS Server is running on port 53"));
