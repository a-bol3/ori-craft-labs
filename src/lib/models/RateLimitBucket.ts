import mongoose, { Model, Schema, models } from "mongoose";

export interface IRateLimitBucket {
  key: string;
  count: number;
  resetAt: Date;
}

const RateLimitBucketSchema = new Schema<IRateLimitBucket>(
  {
    key: { type: String, required: true, unique: true },
    count: { type: Number, required: true, default: 0 },
    resetAt: { type: Date, required: true },
  },
  { timestamps: true }
);

RateLimitBucketSchema.index({ resetAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimitBucket: Model<IRateLimitBucket> =
  models.RateLimitBucket ||
  mongoose.model<IRateLimitBucket>("RateLimitBucket", RateLimitBucketSchema);
