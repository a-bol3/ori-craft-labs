import { sql } from "drizzle-orm";
import { getDb } from "../src/lib/db";

async function main() {
const result = await getDb().execute(sql`
  SELECT table_name FROM information_schema.tables
  WHERE table_schema = 'public' AND table_name IN (
    'users','contact_requests','newsletter_subscribers','rate_limit_buckets',
    'hero_settings','services','offers','insight_posts','legal_pages',
    'media_assets','pages','partners','audit_logs'
  ) ORDER BY table_name
`);
const names = (result as any).rows.map((row: any) => row.table_name);
const expected = ["audit_logs", "contact_requests", "hero_settings", "insight_posts", "legal_pages", "media_assets", "newsletter_subscribers", "offers", "pages", "partners", "rate_limit_buckets", "services", "users"];
const missing = expected.filter((name) => !names.includes(name));
if (missing.length) throw new Error(`Missing database tables: ${missing.join(", ")}`);
console.log(JSON.stringify({ ok: true, tables: names }, null, 2));
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
