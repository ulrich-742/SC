// Load environment variables from .env file
import "dotenv/config";

// Check database connection
// Note: This is optional and can be removed if the database connection
// is not required when starting the application
// Import the Express application from ./app
import app from "./app";
import databaseClient from "../database/client";
import { appPort, validateEnvironment } from "./config/env";

// Get the port from the environment variables
validateEnvironment();

// Start the server and listen on the specified port
const server = app
  .listen(appPort, () => {
    console.info(`Server is listening on port ${appPort}`);
  })
  .on("error", (err: Error) => {
    console.error("Error:", err.message);
  });

const shutdown = async (signal: string) => {
  console.info(`${signal} reçu, arrêt du serveur`);
  server.close(async () => {
    await databaseClient.end();
    process.exit(0);
  });
  setTimeout(() => process.exit(1), 10_000).unref();
};

process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
