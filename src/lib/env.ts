import { z } from "zod";

const databaseSchema = z.object({
  DATABASE_URL: z.string().url(),
  DATABASE_SSL_MODE: z.enum(["disable", "require", "verify-full"]).default("require"),
  DATABASE_SSL_CA: z.string().optional(),
  DATABASE_SSL_CA_FILE: z.string().optional(),
  DATABASE_POOL_SIZE: z.coerce.number().int().min(1).max(50).default(10),
  DATABASE_CONNECTION_TIMEOUT_MS: z.coerce.number().int().min(1000).max(30000).default(5000),
  DATABASE_STATEMENT_TIMEOUT_MS: z.coerce.number().int().min(1000).max(120000).default(10000),
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
  return {
    url: result.data.DATABASE_URL,
    sslMode: result.data.DATABASE_SSL_MODE,
    sslCa: result.data.DATABASE_SSL_CA,
    sslCaFile: result.data.DATABASE_SSL_CA_FILE,
    poolSize: result.data.DATABASE_POOL_SIZE,
    connectionTimeoutMs: result.data.DATABASE_CONNECTION_TIMEOUT_MS,
    statementTimeoutMs: result.data.DATABASE_STATEMENT_TIMEOUT_MS,
  };
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
