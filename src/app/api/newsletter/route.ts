// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createHash, randomBytes } from "node:crypto";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { NewsletterSubscriber } from "@/lib/models/NewsletterSubscriber";
import { enforceRateLimit, requestAddress } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";
import { getSiteUrl } from "@/lib/env";

const newsletterSchema = z.object({
  email: z.string().trim().toLowerCase().email().max(254),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

const consentVersion = "2026-09-06";

export async function POST(req: NextRequest) {
  try {
    const parsed = newsletterSchema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Please provide a valid email and consent." }, { status: 400 });
    }

    const ip = requestAddress(req);
    const rate = await enforceRateLimit(`newsletter:${ip}:${parsed.data.email}`, 2);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: "Please try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
    }

    await dbConnect();

    const token = randomBytes(32).toString("hex");
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const tokenExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { email: parsed.data.email },
      {
        $set: { consent: true, consentVersion, consentAt: new Date(), confirmationTokenHash: tokenHash, confirmationTokenExpiresAt: tokenExpiresAt, emailSent: false },
        $setOnInsert: { email: parsed.data.email },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    let emailSent = false;
    try {
      const confirmationUrl = `${getSiteUrl()}/api/newsletter/confirm?token=${token}`;
      const config = process.env.RESEND_FROM;
      if (config) {
        await sendEmail({
          to: parsed.data.email,
          subject: "Confirm your ORI Craft Labs subscription",
          text: `Confirm your subscription: ${confirmationUrl}\n\nIf you did not request this, you can ignore this email.`,
        });
        emailSent = true;
        await NewsletterSubscriber.findByIdAndUpdate(subscriber._id, { emailSent: true });
      }
    } catch (emailError) {
      console.error("NEWSLETTER_EMAIL_ERROR", emailError instanceof Error ? emailError.message : "Unknown error");
    }

    return NextResponse.json({ success: true, emailSent });
  } catch (error) {
    console.error("NEWSLETTER_API_ERROR", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { error: "Something went wrong. Please try again later." },
      { status: 500 }
    );
  }
}
