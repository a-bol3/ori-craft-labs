import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { dbConnect } from "../src/lib/db";
import { User } from "../src/lib/models/User";

const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, BOOTSTRAP_ADMIN } = process.env;
if (BOOTSTRAP_ADMIN !== "1" || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error("Set BOOTSTRAP_ADMIN=1, ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD for a controlled one-time bootstrap.");
}
if (ADMIN_PASSWORD.length < 14) throw new Error("ADMIN_PASSWORD must be at least 14 characters.");

await dbConnect();
const email = ADMIN_EMAIL.trim().toLowerCase();
const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
await User.findOneAndUpdate(
  { email },
  { $set: { name: ADMIN_NAME.trim(), email, passwordHash, role: "admin", preferredLocale: "pl" } },
  { upsert: true, new: true, setDefaultsOnInsert: true }
);
console.log(`Admin bootstrap completed for ${email}.`);
await mongoose.disconnect();
