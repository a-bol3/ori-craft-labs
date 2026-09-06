// src/app/api/admin/legal/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { LegalPage } from "@/lib/models/LegalPage";

export async function GET() {
  await dbConnect();
  const pages = await LegalPage.find().sort({ slug: 1, locale: 1 }).lean();
  return NextResponse.json({ pages });
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  const { _id, slug, locale, title, intro, content, isActive } = body;

  if (!slug || !title || !content) {
    return NextResponse.json(
      { error: "slug, title and content are required" },
      { status: 400 }
    );
  }

  try {
    let doc;
    if (_id) {
      doc = await LegalPage.findByIdAndUpdate(
        _id,
        {
          slug,
          locale,
          title,
          intro,
          content,
          isActive,
          lastUpdated: new Date(),
        },
        { new: true }
      );
    } else {
      doc = await LegalPage.create({
        slug,
        locale,
        title,
        intro,
        content,
        isActive,
        lastUpdated: new Date(),
      });
    }

    return NextResponse.json({ success: true, page: doc });
  } catch (err) {
    console.error("Error saving legal page", err);
    return NextResponse.json(
      { error: "Failed to save legal page" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id" }, { status: 400 });
  }
  await LegalPage.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
