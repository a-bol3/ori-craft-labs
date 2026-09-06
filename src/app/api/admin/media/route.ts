// src/app/api/admin/media/route.ts
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { MediaAsset } from "@/lib/models/MediaAsset";
import { requireAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await dbConnect();
    await requireAdmin(); // ❗ no args

    const url = new URL(req.url);
    const locale = url.searchParams.get("locale");

    const query: any = {};
    if (locale) query.locale = locale;

    const assets = await MediaAsset.find(query)
      .sort({ section: 1, order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ assets });
  } catch (error: any) {
    console.error("GET /api/admin/media error", error);
    return NextResponse.json(
      { error: "Failed to load media assets" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    await requireAdmin(); // ❗ no args

    const body = await req.json();

    const data = {
      title: body.title,
      slug: body.slug,
      type: body.type,
      url: body.url,
      thumbnailUrl: body.thumbnailUrl || "",
      alt: body.alt || "",
      tags: (body.tags || []) as string[],
      section: body.section || "",
      locale: body.locale || "pl",
      order: Number(body.order) || 0,
      isActive: Boolean(body.isActive),
    };

    let asset;

    if (body._id) {
      asset = await MediaAsset.findByIdAndUpdate(body._id, data, {
        new: true,
      }).lean();
    } else {
      asset = await MediaAsset.create(data);
    }

    return NextResponse.json({ asset });
  } catch (error: any) {
    console.error("POST /api/admin/media error", error);
    return NextResponse.json(
      { error: "Failed to save media asset" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await dbConnect();
    await requireAdmin(); // ❗ no args

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing id parameter" },
        { status: 400 }
      );
    }

    await MediaAsset.findByIdAndDelete(id);

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error("DELETE /api/admin/media error", error);
    return NextResponse.json(
      { error: "Failed to delete media asset" },
      { status: 500 }
    );
  }
}
