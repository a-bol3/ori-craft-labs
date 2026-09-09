import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { dbConnect, getDb } from "@/lib/db";
import { Request } from "@/lib/models/Request";
import { notificationQueue } from "@/lib/schema";
import { enforceRateLimit, requestAddress } from "@/lib/rate-limit";
import { sendEmail } from "@/lib/email";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  message: z.string().trim().min(10).max(5000),
  locale: z.enum(["pl", "en", "es"]).default("pl"),
  offerSlug: z.string().trim().max(160).optional(),
  eventId: z.string().uuid().optional(),
  consent: z.literal(true),
  website: z.string().max(0).optional(),
});

const consentVersion = "2026-09-09";

export async function POST(req: NextRequest) {
  try {
    const parsed = schema.safeParse(await req.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ success: false, error: "Please check the form fields." }, { status: 400 });

    const key = `request:${requestAddress(req)}:${parsed.data.email}`;
    const rate = await enforceRateLimit(key, 3);
    if (!rate.allowed) return NextResponse.json({ success: false, error: "Please try again later." }, { status: 429, headers: { "Retry-After": String(rate.retryAfter) } });

    await dbConnect();
    const created = await Request.create({
      id: randomUUID(),
      kind: parsed.data.eventId ? "event" : parsed.data.offerSlug ? "offer" : "contact",
      name: parsed.data.name,
      email: parsed.data.email,
      message: parsed.data.message,
      locale: parsed.data.locale,
      consent: true,
      consentVersion,
      consentAt: new Date(),
      offerSlug: parsed.data.offerSlug,
      eventId: parsed.data.eventId,
      status: "new",
      notificationStatus: "pending",
    });

    const recipient = process.env.CONTACT_NOTIFY_EMAIL;
    if (recipient) {
      const [queued] = await getDb().insert(notificationQueue).values({
        id: randomUUID(),
        requestId: String(created._id),
        kind: "owner-request",
        recipient,
        subject: `[ORI request] ${parsed.data.offerSlug || parsed.data.eventId || "General inquiry"}`,
        body: `Name: ${parsed.data.name}\nEmail: ${parsed.data.email}\nLocale: ${parsed.data.locale}\n\n${parsed.data.message}`,
        attempts: 0,
        availableAt: new Date(),
        createdAt: new Date(),
      }).returning();
      try {
        await sendEmail({ to: recipient, subject: queued.subject, text: queued.body, replyTo: parsed.data.email });
        await getDb().update(notificationQueue).set({ sentAt: new Date() }).where(eq(notificationQueue.id, queued.id));
        await Request.findByIdAndUpdate(String(created._id), { notificationStatus: "sent" });
      } catch (emailError) {
        console.error("REQUEST_EMAIL_ERROR", emailError instanceof Error ? emailError.message : "Unknown error");
      }
    }

    return NextResponse.json({ success: true, id: String(created._id) }, { status: 201 });
  } catch (error) {
    console.error("REQUEST_API_ERROR", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ success: false, error: "Something went wrong. Please try again later." }, { status: 500 });
  }
}
