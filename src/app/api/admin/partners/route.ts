// src/app/api/admin/partners/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Partner } from "@/lib/models/Partner";

export async function GET() {
  await dbConnect();
  const partners = await Partner.find().sort({ order: 1 }).lean();
  return NextResponse.json({ partners });
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { _id, name, type, locale, description, websiteUrl, logoUrl, isActive, order } =
    body;

  if (!name || !description) {
    return NextResponse.json(
      { error: "name and description are required" },
      { status: 400 }
    );
  }

  try {
    let doc;
    if (_id) {
      doc = await Partner.findByIdAndUpdate(
        _id,
        { name, type, locale, description, websiteUrl, logoUrl, isActive, order },
        { new: true }
      );
    } else {
      doc = await Partner.create({
        name,
        type,
        locale,
        description,
        websiteUrl,
        logoUrl,
        isActive,
        order,
      });
    }

    return NextResponse.json({ success: true, partner: doc });
  } catch (err) {
    console.error("Error saving partner", err);
    return NextResponse.json(
      { error: "Failed to save partner" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });
  await Partner.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
