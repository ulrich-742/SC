"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Load environment variables from .env file
require("dotenv/config");
// Check database connection
// Note: This is optional and can be removed if the database connection
// is not required when starting the application
// Import the Express application from ./app
const app_1 = __importDefault(require("./app"));
const client_1 = __importDefault(require("../database/client"));
const env_1 = require("./config/env");
// Get the port from the environment variables
(0, env_1.validateEnvironment)();
// Start the server and listen on the specified port
const server = app_1.default
    .listen(env_1.appPort, () => {
    console.info(`Server is listening on port ${env_1.appPort}`);
})
    .on("error", (err) => {
    console.error("Error:", err.message);
});
const shutdown = async (signal) => {
    console.info(`${signal} reçu, arrêt du serveur`);
    server.close(async () => {
        await client_1.default.end();
        process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
};
process.on("SIGTERM", () => void shutdown("SIGTERM"));
process.on("SIGINT", () => void shutdown("SIGINT"));
//# sourceMappingURL=main.js.map