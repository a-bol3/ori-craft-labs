// src/lib/models/HeroSettings.ts
import mongoose, { Schema, Model, models } from "mongoose";

export interface IHeroSettings {
  locale: "pl" | "en" | "es";
  titleLine1: string; // "Poczuj rytm."
  titleLine2: string; // "Żyj kulturą."
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
  updatedAt?: Date;
  createdAt?: Date;
}

const HeroSettingsSchema = new Schema<IHeroSettings>(
  {
    locale: {
      type: String,
      enum: ["pl", "en", "es"],
      default: "pl",
      unique: true,
    },
    titleLine1: { type: String, required: true },
    titleLine2: { type: String, required: true },
    subtitle: { type: String, required: true },
    primaryCtaLabel: { type: String, required: true },
    primaryCtaHref: { type: String, required: true },
    secondaryCtaLabel: { type: String, required: true },
    secondaryCtaHref: { type: String, required: true },
  },
  { timestamps: true }
);

export const HeroSettings: Model<IHeroSettings> =
  models.HeroSettings || mongoose.model<IHeroSettings>("HeroSettings", HeroSettingsSchema);
