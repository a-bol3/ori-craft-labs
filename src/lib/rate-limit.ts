import { dbConnect } from "@/lib/db";
import { RateLimitBucket } from "@/lib/models/RateLimitBucket";

export async function enforceRateLimit(
  key: string,
  limit = 5,
  windowMs = 10 * 60 * 1000
) {
  await dbConnect();
  const now = new Date();
  const resetAt = new Date(now.getTime() + windowMs);
  let bucket = await RateLimitBucket.findOne({ key });
  if (!bucket || bucket.resetAt <= now) {
    bucket = await RateLimitBucket.findOneAndUpdate(
      { key },
      { $set: { count: 1, resetAt }, $setOnInsert: { key } },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } else {
    bucket = await RateLimitBucket.findOneAndUpdate(
      { key },
      { $inc: { count: 1 } },
      { new: true }
    );
  }

  if (!bucket || bucket.count > limit) {
    const expiresAt = bucket?.resetAt instanceof Date ? bucket.resetAt.getTime() : resetAt.getTime();
    return { allowed: false, retryAfter: Math.max(1, Math.ceil((expiresAt - now.getTime()) / 1000)) };
  }
  return { allowed: true, retryAfter: 0 };
}

export function requestAddress(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
}
