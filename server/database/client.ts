// Get variables from .env file for database connection
const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;

// Create a connection pool to the database
import mysql from "mysql2/promise";

const client = mysql.createPool({
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
export default client;

// Types export
import type { Pool, ResultSetHeader, RowDataPacket } from "mysql2/promise";

type DatabaseClient = Pool;
type Result = ResultSetHeader;
type Rows = RowDataPacket[];

export type { DatabaseClient, Result, Rows };
