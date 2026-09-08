import { sql } from "drizzle-orm";
import { randomUUID, createHash } from "node:crypto";
import { getDb } from "@/lib/db";

export async function enforceRateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
) {
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);
  const result = await getDb().execute(sql`
    INSERT INTO rate_limit_buckets (id, key, count, reset_at)
    VALUES (${randomUUID()}, ${key}, 1, ${resetAt})
    ON CONFLICT (key) DO UPDATE SET
      count = CASE WHEN rate_limit_buckets.reset_at <= now() THEN 1 ELSE rate_limit_buckets.count + 1 END,
      reset_at = CASE WHEN rate_limit_buckets.reset_at <= now() THEN excluded.reset_at ELSE rate_limit_buckets.reset_at END,
      updated_at = now()
    RETURNING count, reset_at
  `) as unknown as { rows: Array<{ count: number; reset_at: Date }> };
  const bucket = result.rows[0];

  if (!bucket || Number(bucket.count) > limit) {
    const expiresAt = bucket?.reset_at instanceof Date ? bucket.reset_at.getTime() : resetAt.getTime();
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((expiresAt - now.getTime()) / 1000)) };
  }
  return { allowed: true, retryAfter: 0 };
}

export function requestAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const raw = forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
  return createHash("sha256").update(raw).digest("hex");
}
