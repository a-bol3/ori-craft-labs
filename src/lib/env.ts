import { z } from "zod";

const databaseSchema = z.object({
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1),
});

const authSchema = z.object({
  NEXTAUTH_SECRET: z.string().min(32),
  NEXTAUTH_URL: z.string().url(),
});

const emailSchema = z.object({
  RESEND_API_KEY: z.string().min(1),
  RESEND_FROM: z.string().email(),
  CONTACT_NOTIFY_EMAIL: z.string().email(),
  RESEND_REPLY_TO: z.string().email().optional(),
});

export function getDatabaseEnv() {
  const result = databaseSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error("Database configuration is unavailable.");
  }
  return { uri: result.data.MONGODB_URI, dbName: result.data.MONGODB_DB_NAME };
}

export function getAuthEnv() {
  const result = authSchema.safeParse(process.env);
  if (!result.success) {
    throw new Error("Authentication configuration is unavailable.");
  }
  return result.data;
}

export function getEmailEnv() {
  const result = emailSchema.safeParse(process.env);
  return result.success ? result.data : null;
}

export function getSiteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://ori-craftlabs.com";
}
