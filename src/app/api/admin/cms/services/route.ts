// src/app/api/admin/cms/services/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { Service } from "@/lib/models/Service";

function json(data: any, init?: { status?: number }) {
  return NextResponse.json(data, { status: init?.status ?? 200 });
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return null;
  }
  return session;
}

// GET /api/admin/cms/services  -> list all services (for now PL)
export async function GET() {
  const session = await requireAdmin();
  if (!session) return json({ success: false, error: "Unauthorized" }, { status: 401 });

  await dbConnect();
  const docs = await Service.find({ locale: "pl" }).sort({ section: 1, title: 1 }).lean();

  return json({
    success: true,
    services: docs.map((s: any) => ({
      id: s._id.toString(),
      locale: s.locale,
      section: s.section,
      title: s.title,
      subtitle: s.subtitle,
      slug: s.slug,
      shortDescription: s.shortDescription,
      valueSummary: s.valueSummary,
      priceFrom: s.priceFrom || "",
      duration: s.duration || "",
      bullets: s.bullets || [],
      isActive: !!s.isActive,
    })),
  });
}

// POST /api/admin/cms/services  -> create service
export async function POST(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body) return json({ success: false, error: "Invalid JSON" }, { status: 400 });

  const {
    section,
    title,
    subtitle,
    slug,
    shortDescription,
    valueSummary,
    priceFrom,
    duration,
    bullets,
  } = body;

  if (!section || !title || !subtitle || !slug || !shortDescription || !valueSummary) {
    return json(
      { success: false, error: "Missing required fields." },
      { status: 400 }
    );
  }

  await dbConnect();

  const created = await Service.create({
    locale: "pl",
    section,
    title,
    subtitle,
    slug,
    shortDescription,
    valueSummary,
    priceFrom,
    duration,
    bullets: Array.isArray(bullets) ? bullets : [],
  });

  return json({
    success: true,
    service: {
      id: created._id.toString(),
      locale: created.locale,
      section: created.section,
      title: created.title,
      subtitle: created.subtitle,
      slug: created.slug,
      shortDescription: created.shortDescription,
      valueSummary: created.valueSummary,
      priceFrom: created.priceFrom || "",
      duration: created.duration || "",
      bullets: created.bullets || [],
      isActive: !!created.isActive,
    },
  });
}

// PUT /api/admin/cms/services  -> update existing service
export async function PUT(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !body.id) {
    return json({ success: false, error: "Missing id" }, { status: 400 });
  }

  const {
    id,
    section,
    title,
    subtitle,
    slug,
    shortDescription,
    valueSummary,
    priceFrom,
    duration,
    bullets,
    isActive,
  } = body;

  await dbConnect();

  const updated = await Service.findByIdAndUpdate(
    id,
    {
      section,
      title,
      subtitle,
      slug,
      shortDescription,
      valueSummary,
      priceFrom,
      duration,
      bullets: Array.isArray(bullets) ? bullets : [],
      isActive: !!isActive,
    },
    { new: true }
  ).lean();

  if (!updated) {
    return json({ success: false, error: "Service not found" }, { status: 404 });
  }

  return json({
    success: true,
    service: {
      id: updated._id.toString(),
      locale: updated.locale,
      section: updated.section,
      title: updated.title,
      subtitle: updated.subtitle,
      slug: updated.slug,
      shortDescription: updated.shortDescription,
      valueSummary: updated.valueSummary,
      priceFrom: updated.priceFrom || "",
      duration: updated.duration || "",
      bullets: updated.bullets || [],
      isActive: !!updated.isActive,
    },
  });
}

// DELETE /api/admin/cms/services  -> delete by id
export async function DELETE(req: NextRequest) {
  const session = await requireAdmin();
  if (!session) return json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => null);
  if (!body || !body.id) {
    return json({ success: false, error: "Missing id" }, { status: 400 });
  }

  await dbConnect();
  await Service.findByIdAndDelete(body.id);

  return json({ success: true });
}
