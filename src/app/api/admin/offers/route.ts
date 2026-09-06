// src/app/api/admin/offers/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { Offer } from "@/lib/models/Offer";

export async function GET() {
  await dbConnect();
  const offers = await Offer.find().sort({ group: 1, order: 1 }).lean();
  return NextResponse.json({ offers });
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();

  try {
    const {
      _id,
      group,
      slug,
      locale,
      title,
      subtitle,
      priceFrom,
      duration,
      includes,
      value,
      idealFor,
      notes,
      order,
      isActive,
    } = body;

    if (!group || !slug || !title || !value) {
      return NextResponse.json(
        { error: "group, slug, title, and value are required" },
        { status: 400 }
      );
    }

    let doc;
    if (_id) {
      doc = await Offer.findByIdAndUpdate(
        _id,
        {
          group,
          slug,
          locale,
          title,
          subtitle,
          priceFrom,
          duration,
          includes: includes || [],
          value,
          idealFor,
          notes,
          order: order ?? 0,
          isActive: isActive ?? true,
        },
        { new: true }
      );
    } else {
      doc = await Offer.create({
        group,
        slug,
        locale,
        title,
        subtitle,
        priceFrom,
        duration,
        includes: includes || [],
        value,
        idealFor,
        notes,
        order: order ?? 0,
        isActive: isActive ?? true,
      });
    }

    return NextResponse.json({ success: true, offer: doc });
  } catch (err) {
    console.error("Error saving offer", err);
    return NextResponse.json(
      { error: "Failed to save offer" },
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

  await Offer.findByIdAndDelete(id);
  return NextResponse.json({ success: true });
}
