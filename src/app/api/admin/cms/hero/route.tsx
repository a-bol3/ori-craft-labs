// src/app/api/admin/cms/hero/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { HeroSettings } from "@/lib/models/HeroSettings";

function json(data: any, init?: { status?: number }) {
  return NextResponse.json(data, { status: init?.status ?? 200 });
}

// GET: fetch hero settings for PL (for now)
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  let doc = await HeroSettings.findOne({ locale: "pl" }).lean();

  // If no document yet, create default based on your current hero text
  if (!doc) {
    doc = (
      await HeroSettings.create({
        locale: "pl",
        titleLine1: "Poczuj rytm.",
        titleLine2: "Żyj kulturą.",
        subtitle:
          "Ori Craft Labs to ciepła przestrzeń, gdzie latynoski ruch, świadomość ciała, kubańsko-polskie smaki i wspólne rytuały łączą się w jedno doświadczenie.",
        primaryCtaLabel: "Rozpocznij podróż",
        primaryCtaHref: "#oferta",
        secondaryCtaLabel: "Zobacz ofertę",
        secondaryCtaHref: "#oferta",
      })
    );
  }

  return json({
    success: true,
    hero: {
      locale: doc.locale,
      titleLine1: doc.titleLine1,
      titleLine2: doc.titleLine2,
      subtitle: doc.subtitle,
      primaryCtaLabel: doc.primaryCtaLabel,
      primaryCtaHref: doc.primaryCtaHref,
      secondaryCtaLabel: doc.secondaryCtaLabel,
      secondaryCtaHref: doc.secondaryCtaHref,
    },
  });
}

// PUT: update hero settings
export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (!body) {
    return json({ success: false, error: "Invalid JSON" }, { status: 400 });
  }

  const {
    titleLine1,
    titleLine2,
    subtitle,
    primaryCtaLabel,
    primaryCtaHref,
    secondaryCtaLabel,
    secondaryCtaHref,
  } = body;

  if (!titleLine1 || !titleLine2 || !subtitle) {
    return json(
      { success: false, error: "Title and subtitle are required." },
      { status: 400 }
    );
  }

  await dbConnect();

  const updated = await HeroSettings.findOneAndUpdate(
    { locale: "pl" },
    {
      titleLine1,
      titleLine2,
      subtitle,
      primaryCtaLabel,
      primaryCtaHref,
      secondaryCtaLabel,
      secondaryCtaHref,
    },
    { new: true, upsert: true }
  ).lean();

  return json({
    success: true,
    hero: {
      locale: updated.locale,
      titleLine1: updated.titleLine1,
      titleLine2: updated.titleLine2,
      subtitle: updated.subtitle,
      primaryCtaLabel: updated.primaryCtaLabel,
      primaryCtaHref: updated.primaryCtaHref,
      secondaryCtaLabel: updated.secondaryCtaLabel,
      secondaryCtaHref: updated.secondaryCtaHref,
    },
  });
}
