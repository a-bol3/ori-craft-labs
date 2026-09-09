import { readFileSync } from "node:fs";
import { Client } from "pg";

const target = process.env.TARGET_DATABASE;
const sourceUrl = process.env.DATABASE_URL;
if (!target || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(target)) {
  throw new Error("TARGET_DATABASE must be a valid database identifier.");
}
if (!sourceUrl) throw new Error("DATABASE_URL is required.");
const connectionString = sourceUrl;

async function main() {
  const url = new URL(connectionString);
  url.pathname = "/defaultdb";
  const ca = process.env.DATABASE_SSL_CA_FILE
    ? readFileSync(process.env.DATABASE_SSL_CA_FILE, "utf8")
    : process.env.DATABASE_SSL_CA;
  const client = new Client({
    connectionString: url.toString(),
    ssl: { rejectUnauthorized: true, ca: ca || undefined },
  });
  await client.connect();
  try {
    await client.query(`CREATE DATABASE IF NOT EXISTS "${target}"`);
    console.log(JSON.stringify({ ok: true, database: target }));
  } finally {
    await client.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
