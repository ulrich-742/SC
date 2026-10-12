import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import mysql from "mysql2/promise";

const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
if (!DB_NAME || !/^[a-zA-Z0-9_]+$/.test(DB_NAME)) throw new Error("DB_NAME manquant ou invalide");

async function migrate() {
  const databaseDir = path.basename(process.cwd()).toLowerCase() === "server"
    ? path.resolve(process.cwd(), "database")
    : path.resolve(process.cwd(), "server/database");
  const connection = await mysql.createConnection({ host: DB_HOST, port: Number(DB_PORT ?? 3306), user: DB_USER, password: DB_PASSWORD, multipleStatements: true });
  try {
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\``);
    await connection.query(`USE \`${DB_NAME}\``);
    const [tables] = await connection.query<mysql.RowDataPacket[]>("SELECT 1 FROM information_schema.tables WHERE table_schema = ? AND table_name = 'users'", [DB_NAME]);
    if (tables.length === 0) {
      await connection.query(fs.readFileSync(path.join(databaseDir, "schema.sql"), "utf8"));
    }
    await connection.query("CREATE TABLE IF NOT EXISTS schema_migrations (name VARCHAR(255) PRIMARY KEY, applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)");
    const migrationsDir = path.join(databaseDir, "migrations");
    for (const name of fs.readdirSync(migrationsDir).filter((file) => file.endsWith(".sql")).sort()) {
      const [done] = await connection.query<mysql.RowDataPacket[]>("SELECT 1 FROM schema_migrations WHERE name = ?", [name]);
      if (done.length > 0) continue;
      await connection.beginTransaction();
      try {
        await connection.query(fs.readFileSync(path.join(migrationsDir, name), "utf8"));
        await connection.query("INSERT INTO schema_migrations (name) VALUES (?)", [name]);
        await connection.commit();
      } catch (error) {
        await connection.rollback();
        throw error;
      }
    }
    console.info(`Base ${DB_NAME} à jour`);
  } finally {
    await connection.end();
  }
}

migrate().catch((error: Error) => {
  console.error("Migration impossible:", error.message);
  process.exitCode = 1;
});
