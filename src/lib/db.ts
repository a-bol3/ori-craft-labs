// src/lib/db.ts
import { readFileSync } from "node:fs";
import { Pool } from "pg";
import { sql } from "drizzle-orm";
import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { getDatabaseEnv } from "@/lib/env";
import * as schema from "@/lib/schema";

export type Database = NodePgDatabase<typeof schema>;

const globalForDb = globalThis as typeof globalThis & {
  oriDb?: Database;
  oriPool?: Pool;
};

export function getDb(): Database {
  if (globalForDb.oriDb) return globalForDb.oriDb;
  const env = getDatabaseEnv();
  const sslCa = env.sslCaFile ? readFileSync(env.sslCaFile, "utf8") : env.sslCa;
  const pool = new Pool({
    connectionString: env.url,
    max: env.poolSize,
    connectionTimeoutMillis: env.connectionTimeoutMs,
    statement_timeout: env.statementTimeoutMs,
    ssl: env.sslMode === "disable" ? false : { rejectUnauthorized: true, ca: sslCa || undefined },
  });
  globalForDb.oriPool = pool;
  globalForDb.oriDb = drizzle(pool, { schema });
  return globalForDb.oriDb;
}

export async function dbConnect() {
  const db = getDb();
  await db.execute(sql`select 1`);
  return db;
}

export async function dbHealth() {
  try {
    await dbConnect();
    return true;
  } catch (error) {
    console.error("DATABASE_HEALTH_ERROR", error instanceof Error ? error.message : "Unknown error");
    return false;
  }
}
