// src/lib/models/Partner.ts
import mongoose, { Schema, Document, Model } from "mongoose";

export type PartnerType = "cafe" | "physio" | "culture-space" | "other";

export interface IPartner extends Document {
  name: string;
  type: PartnerType;
  locale: "pl" | "en" | "es";
  description: string;
  websiteUrl?: string;
  logoUrl?: string;
  isActive: boolean;
  order: number;
}

const PartnerSchema = new Schema<IPartner>(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["cafe", "physio", "culture-space", "other"],
      default: "other",
    },
    locale: {
      type: String,
      enum: ["pl", "en", "es"],
      default: "pl",
      index: true,
    },
    description: { type: String, required: true },
    websiteUrl: { type: String },
    logoUrl: { type: String },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Partner: Model<IPartner> =
  mongoose.models.Partner ||
  mongoose.model<IPartner>("Partner", PartnerSchema);
