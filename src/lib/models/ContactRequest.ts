// src/lib/models/ContactRequest.ts
import mongoose, { Schema, Model, models } from "mongoose";

export interface IContactRequest {
  name: string;
  email: string;
  subject: string;
  message: string;
  consent: boolean;
  consentVersion: string;
  consentAt: Date;
  emailSent?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ContactRequestSchema = new Schema<IContactRequest>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    consent: { type: Boolean, required: true },
    consentVersion: { type: String, required: true },
    consentAt: { type: Date, required: true },
    emailSent: { type: Boolean, default: false },
  },
  {
    timestamps: true, // adds createdAt / updatedAt
  }
);

// Avoid model overwrite in dev (Next.js hot reload)
export const ContactRequest: Model<IContactRequest> =
  models.ContactRequest || mongoose.model<IContactRequest>("ContactRequest", ContactRequestSchema);
