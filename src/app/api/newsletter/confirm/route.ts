import { createHash } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { NewsletterSubscriber } from "@/lib/models/NewsletterSubscriber";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  if (!token || token.length < 32) {
    return NextResponse.json({ success: false, error: "Invalid confirmation link." }, { status: 400 });
  }

  try {
    await dbConnect();
    const tokenHash = createHash("sha256").update(token).digest("hex");
    const subscriber = await NewsletterSubscriber.findOneAndUpdate(
      { confirmationTokenHash: tokenHash, confirmationTokenExpiresAt: { $gt: new Date() } },
      { $set: { confirmedAt: new Date() }, $unset: { confirmationTokenHash: 1, confirmationTokenExpiresAt: 1 } },
      { new: true }
    );
    if (!subscriber) {
      return NextResponse.json({ success: false, error: "Invalid or expired confirmation link." }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("NEWSLETTER_CONFIRM_ERROR", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ success: false, error: "Unable to confirm subscription." }, { status: 500 });
  }
}
