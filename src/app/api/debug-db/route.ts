// src/app/api/debug-db/route.ts
import { NextRequest, NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET(_req: NextRequest) {
  try {
    await requireAdmin();
    await dbConnect();
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DEBUG_DB_ERROR", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json(
      { ok: false, error: "Not available." },
      { status: 404 }
    );
  }
}
