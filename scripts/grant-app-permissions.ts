import { sql } from "drizzle-orm";
import { getDb } from "../src/lib/db";

const role = process.env.APP_DB_ROLE;
if (!role || !/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(role)) {
  throw new Error("APP_DB_ROLE must be a valid SQL role identifier.");
}

const tables = ["content_revisions", "events", "requests", "notification_queue"];

async function main() {
  const db = getDb();
  for (const table of tables) {
    await db.execute(sql.raw(`GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE \"${table}\" TO \"${role}\"`));
  }
  console.log(JSON.stringify({ ok: true, role, tables }));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
