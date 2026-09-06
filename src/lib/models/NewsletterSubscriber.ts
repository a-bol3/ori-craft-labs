// src/lib/models/NewsletterSubscriber.ts
import { Schema, model, models, Model } from "mongoose";

export interface INewsletterSubscriber {
  email: string;
  consent: boolean;
  consentVersion: string;
  consentAt: Date;
  confirmationTokenHash?: string;
  confirmationTokenExpiresAt?: Date;
  confirmedAt?: Date;
  unsubscribedAt?: Date;
  emailSent?: boolean;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true },
    consent: { type: Boolean, required: true },
    consentVersion: { type: String, required: true },
    consentAt: { type: Date, required: true },
    confirmationTokenHash: { type: String, index: true, select: false },
    confirmationTokenExpiresAt: { type: Date },
    confirmedAt: { type: Date },
    unsubscribedAt: { type: Date },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const NewsletterSubscriber =
  models.NewsletterSubscriber ||
  model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);
