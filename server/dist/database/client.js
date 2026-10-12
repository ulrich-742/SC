"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Get variables from .env file for database connection
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
// Create a connection pool to the database
const promise_1 = __importDefault(require("mysql2/promise"));
const client = promise_1.default.createPool({
    host: DB_HOST,
    port: Number.parseInt(DB_PORT ?? "3306", 10),
    user: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
    enableKeepAlive: true,
});
// Ready to export
exports.default = client;
//# sourceMappingURL=client.js.map