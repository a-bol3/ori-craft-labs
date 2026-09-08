import { MongoClient, ObjectId } from "mongodb";
import { createSqlModel } from "../src/lib/sql-model";
import { sqlTables } from "../src/lib/schema";

const uri = process.env.LEGACY_MONGODB_URI;
const dbName = process.env.LEGACY_MONGODB_DB_NAME;
const apply = process.argv.includes("--apply");
if (!uri || !dbName) {
  console.log("No legacy MongoDB source configured. Set LEGACY_MONGODB_URI and LEGACY_MONGODB_DB_NAME for a read-only inventory.");
  process.exit(0);
}
const legacyUri = uri;
const legacyDbName = dbName;

async function main() {
const client = new MongoClient(legacyUri, { serverSelectionTimeoutMS: 5000 });
await client.connect();
const source = client.db(legacyDbName);
const mappings: Record<string, { collection: string; model: any; fields: string[] }> = {
  users: { collection: "users", model: createSqlModel(sqlTables.users), fields: ["name", "email", "passwordHash", "role", "preferredLocale"] },
  contactRequests: { collection: "contactrequests", model: createSqlModel(sqlTables.contactRequests), fields: ["name", "email", "subject", "message", "consent", "consentVersion", "consentAt", "emailSent"] },
  newsletterSubscribers: { collection: "newslettersubscribers", model: createSqlModel(sqlTables.newsletterSubscribers), fields: ["email", "consent", "consentVersion", "consentAt", "confirmationTokenHash", "confirmationTokenExpiresAt", "confirmedAt", "unsubscribedAt", "emailSent"] },
  heroSettings: { collection: "herosettings", model: createSqlModel(sqlTables.heroSettings), fields: ["locale", "titleLine1", "titleLine2", "subtitle", "primaryCtaLabel", "primaryCtaHref", "secondaryCtaLabel", "secondaryCtaHref"] },
  services: { collection: "services", model: createSqlModel(sqlTables.services), fields: ["locale", "section", "title", "subtitle", "slug", "shortDescription", "valueSummary", "priceFrom", "duration", "bullets", "isActive"] },
  offers: { collection: "offers", model: createSqlModel(sqlTables.offers), fields: ["group", "slug", "locale", "title", "subtitle", "priceFrom", "duration", "includes", "value", "idealFor", "notes", "order", "isActive"] },
  insightPosts: { collection: "insightposts", model: createSqlModel(sqlTables.insightPosts), fields: ["title", "slug", "category", "locale", "excerpt", "content", "publishedAt"] },
  legalPages: { collection: "legalpages", model: createSqlModel(sqlTables.legalPages), fields: ["slug", "locale", "title", "intro", "content", "lastUpdated", "isActive"] },
  mediaAssets: { collection: "mediaassets", model: createSqlModel(sqlTables.mediaAssets), fields: ["title", "slug", "type", "url", "thumbnailUrl", "alt", "tags", "section", "locale", "order", "isActive"] },
  pages: { collection: "pages", model: createSqlModel(sqlTables.pages), fields: ["pageId", "slug", "locale", "title", "heroTitle", "heroSubtitle", "lead", "mainContent", "showInNav", "navLabel", "order", "status"] },
  partners: { collection: "partners", model: createSqlModel(sqlTables.partners), fields: ["name", "type", "locale", "description", "websiteUrl", "logoUrl", "isActive", "order"] },
};

const report: Record<string, number> = {};
for (const [name, mapping] of Object.entries(mappings)) {
  const docs = await source.collection(mapping.collection).find({}).toArray();
  report[name] = docs.length;
  if (!apply) continue;
  for (const doc of docs) {
    const input: Record<string, unknown> = { legacyMongoId: String(doc._id instanceof ObjectId ? doc._id.toHexString() : doc._id) };
    for (const field of mapping.fields) if (doc[field] !== undefined) input[field] = doc[field];
    if (input.email && typeof input.email === "string") input.email = input.email.trim().toLowerCase();
    if (input.slug && typeof input.slug === "string") input.slug = input.slug.trim();
    try { await mapping.model.create(input); } catch (error) { console.warn(`Skipped ${name} record due to conflict or invalid data.`); }
  }
}
console.log(JSON.stringify({ apply, collections: report }, null, 2));
await client.close();
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
