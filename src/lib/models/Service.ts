// src/lib/models/Service.ts
import mongoose, { Schema, Model, models } from "mongoose";

export type ServiceSection =
  | "wellbeing-movement"
  | "culture-in-motion"
  | "flavors-kitchen"
  | "education-schools"
  | "corporate-organizations"
  | "community-private";

export interface IService {
  _id?: string;
  locale: "pl" | "en" | "es";

  // For admin
  section: ServiceSection; // where it appears (Wellbeing, Culture, etc)
  title: string;           // e.g. "Movement & Flow"
  subtitle: string;        // short subheading
  slug: string;            // "movement-flow"

  shortDescription: string; // used on cards
  valueSummary: string;     // 1–2 sentences about benefits

  priceFrom?: string;       // e.g. "od 1000 zł"
  duration?: string;        // e.g. "60–90 min"

  // bullet points (we'll store as simple array of strings)
  bullets: string[];

  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ServiceSchema = new Schema<IService>(
  {
    locale: {
      type: String,
      enum: ["pl", "en", "es"],
      required: true,
      default: "pl",
    },
    section: {
      type: String,
      enum: [
        "wellbeing-movement",
        "culture-in-motion",
        "flavors-kitchen",
        "education-schools",
        "corporate-organizations",
        "community-private",
      ],
      required: true,
    },
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    shortDescription: { type: String, required: true },
    valueSummary: { type: String, required: true },
    priceFrom: { type: String },
    duration: { type: String },
    bullets: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Service: Model<IService> =
  models.Service || mongoose.model<IService>("Service", ServiceSchema);
