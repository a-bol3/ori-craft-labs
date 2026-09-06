// src/app/api/admin/pages/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Page } from "@/lib/models/Page";
import { requireAdmin } from "@/lib/auth";

// GET /api/admin/pages?locale=pl  -> list
// GET /api/admin/pages?locale=pl&slug=schools -> single
export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    await requireAdmin();

    const url = new URL(req.url);
    const locale = (url.searchParams.get("locale") as "pl" | "en" | "es") || "pl";
    const slug = url.searchParams.get("slug");

    if (slug) {
      const page = await Page.findOne({ slug, locale }).lean();
      return NextResponse.json({ page });
    }

    const pages = await Page.find({ locale }).sort({ order: 1, title: 1 }).lean();
    return NextResponse.json({ pages });
  } catch (error: any) {
    console.error("GET /api/admin/pages error", error);
    return NextResponse.json(
      { error: "Failed to load pages" },
      { status: 500 }
    );
  }
}

// POST /api/admin/pages  (create or update)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    await requireAdmin();

    const body = await req.json();

    const data = {
      pageId: body.pageId,
      slug: body.slug,
      locale: (body.locale as "pl" | "en" | "es") || "pl",
      title: body.title,
      heroTitle: body.heroTitle || "",
      heroSubtitle: body.heroSubtitle || "",
      lead: body.lead || "",
      mainContent: body.mainContent || "",
      showInNav: Boolean(body.showInNav),
      navLabel: body.navLabel || "",
      order: Number(body.order) || 0,
      status: (body.status as any) || "draft",
    };

    let page;

    if (body._id) {
      page = await Page.findByIdAndUpdate(body._id, data, {
        new: true,
      }).lean();
    } else {
      page = await Page.create(data);
    }

    return NextResponse.json({ page });
  } catch (error: any) {
    console.error("POST /api/admin/pages error", error);
    return NextResponse.json(
      { error: "Failed to save page" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/pages?id=...
export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    await requireAdmin();

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    await Page.findByIdAndDelete(id);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE /api/admin/pages error", error);
    return NextResponse.json(
      { error: "Failed to delete page" },
      { status: 500 }
    );
  }
}
