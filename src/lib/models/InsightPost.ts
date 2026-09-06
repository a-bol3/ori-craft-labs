// src/lib/models/InsightPost.ts
import mongoose, { Schema, Model, models } from "mongoose";

export type InsightCategory =
  | "movement"
  | "rituals"
  | "body-awareness"
  | "culture"
  | "other";

export interface IInsightPost {
  title: string;
  slug: string;
  category: InsightCategory;
  locale: "pl" | "en" | "es";
  excerpt: string;
  content: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

const InsightPostSchema = new Schema<IInsightPost>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    category: {
      type: String,
      enum: ["movement", "rituals", "body-awareness", "culture", "other"],
      default: "other",
    },
    locale: {
      type: String,
      enum: ["pl", "en", "es"],
      default: "pl",
      index: true,
    },
    excerpt: { type: String, required: true },
    content: { type: String, required: true },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export const InsightPost: Model<IInsightPost> =
  models.InsightPost ||
  mongoose.model<IInsightPost>("InsightPost", InsightPostSchema);
