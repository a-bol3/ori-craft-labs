// src/lib/models/MediaAsset.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export type MediaType = "image" | "video";

export interface MediaAssetDocument extends Document {
  title: string;
  slug: string;
  type: MediaType;
  url: string;
  thumbnailUrl?: string;
  alt?: string; 
  tags: string[];
  section?: string; // e.g. "hero", "services", "offers"
  locale: "pl" | "en" | "es";
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MediaAssetSchema = new Schema<MediaAssetDocument>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    type: {
      type: String,
      enum: ["image", "video"],
      required: true,
    },
    url: { type: String, required: true },
    thumbnailUrl: { type: String },
    alt: { type: String },
    tags: { type: [String], default: [] },
    section: { type: String },
    locale: {
      type: String,
      enum: ["pl", "en", "es"],
      default: "pl",
    },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

export const MediaAsset =
  (mongoose.models.MediaAsset as Model<MediaAssetDocument>) ||
  mongoose.model<MediaAssetDocument>("MediaAsset", MediaAssetSchema);
