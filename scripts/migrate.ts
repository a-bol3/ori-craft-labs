import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { sql } from "drizzle-orm";
import { getDb } from "../src/lib/db";

function splitMigrationStatements(contents: string) {
  return contents
    .split(/;\s*(?=(?:CREATE|ALTER|INSERT|UPDATE|DELETE|DROP|GRANT|REVOKE)\b)/i)
    .map((statement) => statement.trim())
    .filter(Boolean);
}

async function main() {
  const db = getDb();
  await db.execute(sql`CREATE TABLE IF NOT EXISTS schema_migrations (filename varchar(255) PRIMARY KEY, applied_at timestamptz NOT NULL DEFAULT now())`);
  const appliedResult = await db.execute(sql`SELECT filename FROM schema_migrations`);
  const applied = new Set((appliedResult as any).rows.map((row: any) => row.filename));
  const files = (await readdir(path.resolve("drizzle"))).filter((file) => file.endsWith(".sql")).sort();
  for (const filename of files) {
    if (applied.has(filename)) continue;
    const contents = await readFile(path.resolve("drizzle", filename), "utf8");
    const statements = splitMigrationStatements(contents);
    for (const [index, statement] of statements.entries()) {
      await db.execute(sql.raw(statement));
      console.log(`Applied ${filename} statement ${index + 1}/${statements.length}`);
    }
    await db.execute(sql`INSERT INTO schema_migrations (filename) VALUES (${filename}) ON CONFLICT (filename) DO NOTHING`);
    console.log(`Recorded ${filename}`);
  }
  console.log("ORI Craft Labs database migrations completed.");
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
