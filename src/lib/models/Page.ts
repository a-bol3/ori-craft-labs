// src/lib/models/Page.ts
import mongoose, { Schema, Model, Document } from "mongoose";

export type PageStatus = "draft" | "review" | "published";

export interface PageDocument extends Document {
  pageId: string; // internal identifier (e.g. "schools")
  slug: string;   // URL segment (e.g. "schools")
  locale: "pl" | "en" | "es";
  title: string;
  heroTitle?: string;
  heroSubtitle?: string;
  lead?: string;
  mainContent?: string;
  showInNav: boolean;
  navLabel?: string;
  order: number;
  status: PageStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PageSchema = new Schema<PageDocument>(
  {
    pageId: { type: String, required: true },
    slug: { type: String, required: true },
    locale: {
      type: String,
      enum: ["pl", "en", "es"],
      default: "pl",
    },
    title: { type: String, required: true },
    heroTitle: { type: String },
    heroSubtitle: { type: String },
    lead: { type: String },
    mainContent: { type: String },
    showInNav: { type: Boolean, default: false },
    navLabel: { type: String },
    order: { type: Number, default: 0 },
    status: {
      type: String,
      enum: ["draft", "review", "published"],
      default: "draft",
    },
  },
  {
    timestamps: true,
  }
);

PageSchema.index({ slug: 1, locale: 1 }, { unique: true });

export const Page =
  (mongoose.models.Page as Model<PageDocument>) ||
  mongoose.model<PageDocument>("Page", PageSchema);
