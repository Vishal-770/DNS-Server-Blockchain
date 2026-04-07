/**
 * DNS Server Modular Entry Point
 */
import server from "./src/core/server.js";

// Start the server
server.start();

// Handle Graceful Shutdown
const shutdown = async () => {
  console.log("\n⏹️ Received termination signal, shutting down...");
  await server.stop();
  process.exit(0);
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  shutdown();
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  shutdown();
});
