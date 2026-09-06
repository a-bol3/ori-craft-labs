// src/lib/models/Offer.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export type OfferGroup =
  | "children-youth"
  | "adults"
  | "corporate"
  | "cooking-tasting"
  | "culture-evening"
  | "team-offsite"
  | "retreats";

export interface IOffer extends Document {
  group: OfferGroup;
  slug: string;
  locale: "pl" | "en" | "es";
  title: string;
  subtitle?: string;
  priceFrom?: string; // e.g. "od 1000 zł"
  duration?: string;  // e.g. "60–90 min"
  includes: string[]; // bullet list
  value: string;      // "Wartość" text
  idealFor?: string;  // "Idealne dla" text
  notes?: string;     // any extra info (e.g. ℹ️)
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const OfferSchema = new Schema<IOffer>(
  {
    group: {
      type: String,
      enum: [
        "children-youth",
        "adults",
        "corporate",
        "cooking-tasting",
        "culture-evening",
        "team-offsite",
        "retreats",
      ],
      required: true,
    },
    slug: { type: String, required: true, unique: true },
    locale: {
      type: String,
      enum: ["pl", "en", "es"],
      default: "pl",
      index: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String },
    priceFrom: { type: String },
    duration: { type: String },
    includes: [{ type: String }],
    value: { type: String, required: true },
    idealFor: { type: String },
    notes: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Offer: Model<IOffer> =
  mongoose.models.Offer || mongoose.model<IOffer>("Offer", OfferSchema);
