import { rateLimitBuckets } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export const RateLimitBucket = createSqlModel(rateLimitBuckets);
