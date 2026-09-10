import bcrypt from "bcryptjs";
import { dbConnect } from "../src/lib/db";
import { User } from "../src/lib/models/User";
import { recordAudit } from "../src/lib/editorial";

async function main() {
const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, BOOTSTRAP_ADMIN } = process.env;
if (BOOTSTRAP_ADMIN !== "1" || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("Set BOOTSTRAP_ADMIN=1, ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD for a controlled one-time bootstrap.");
if (ADMIN_PASSWORD.length < 14) throw new Error("ADMIN_PASSWORD must be at least 14 characters.");

await dbConnect();
const email = ADMIN_EMAIL.trim().toLowerCase();
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
const admin = await User.findOneAndUpdate(
  { email },
  { $set: { name: ADMIN_NAME.trim(), email, passwordHash, role: "admin", preferredLocale: "pl" } },
  { upsert: true, new: true }
);
if (!admin) throw new Error("Admin bootstrap did not return an administrator record.");
await recordAudit({
  actorUserId: String(admin.id ?? admin._id),
  action: "admin.bootstrap",
  entity: "user",
  entityId: String(admin.id ?? admin._id),
  metadata: { role: "admin", source: "controlled_bootstrap" },
});
console.log(`Admin bootstrap completed for ${email}.`);
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
