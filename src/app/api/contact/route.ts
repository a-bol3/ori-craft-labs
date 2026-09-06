// src/app/api/contact/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { dbConnect } from "@/lib/db";
import { ContactRequest } from "@/lib/models/ContactRequest";
import { enforceRateLimit, requestAddress } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

const consentVersion = "2026-09-06";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ success: false, error: "Please check the form fields." }, { status: 400 });
    }

    const ip = requestAddress(req);
    const rate = await enforceRateLimit(`contact:${ip}:${parsed.data.email}`, 3);
    if (!rate.allowed) {
      return NextResponse.json({ success: false, error: "Please try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });
    }

    await dbConnect();

    const record = await ContactRequest.create({
      name: parsed.data.name,
      email: parsed.data.email,
      subject: parsed.data.subject,
      message: parsed.data.message,
      consent: parsed.data.consent,
      consentVersion,
      consentAt: new Date(),
      emailSent: false,
    });

    let emailSent = false;
    try {
      const config = process.env.CONTACT_NOTIFY_EMAIL;
      if (config) {
        await sendEmail({
          to: config,
          replyTo: parsed.data.email,
          subject: `[ORI contact] ${parsed.data.subject}`,
          text: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
        });
        emailSent = true;
        await ContactRequest.findByIdAndUpdate(record._id, { emailSent: true });
      }
    } catch (emailError) {
      console.error("CONTACT_EMAIL_ERROR", emailError instanceof Error ? emailError.message : "Unknown error");
    }

    return NextResponse.json({ success: true, emailSent }, { status: 201 });
  } catch (error) {
    console.error("CONTACT_API_ERROR", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { success: false, error: "Internal server error." },
      { status: 500 }
    );
  }
}
