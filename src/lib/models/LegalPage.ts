// src/lib/models/LegalPage.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type LegalSlug =
  | "terms-of-service"
  | "privacy-policy"
  | "cookie-policy"
  | "cookie-preferences";

export interface ILegalPage extends Document {
  slug: LegalSlug;
  locale: "pl" | "en" | "es";
  title: string;
  intro?: string;
  content: string; // markdown-ish plain text
  lastUpdated: Date;
  isActive: boolean;
}

const LegalPageSchema = new Schema<ILegalPage>(
  {
    slug: {
      type: String,
      enum: [
        "terms-of-service",
        "privacy-policy",
        "cookie-policy",
        "cookie-preferences",
      ],
      required: true,
      index: true,
    },
    locale: {
      type: String,
      enum: ["pl", "en", "es"],
      default: "pl",
      index: true,
    },
    title: { type: String, required: true },
    intro: { type: String },
    content: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const LegalPage: Model<ILegalPage> =
  mongoose.models.LegalPage ||
  mongoose.model<ILegalPage>("LegalPage", LegalPageSchema);
