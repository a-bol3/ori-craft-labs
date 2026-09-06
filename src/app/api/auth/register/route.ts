// src/app/api/auth/register/route.ts
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  void req;
  return NextResponse.json(
    { success: false, error: "Public registration is disabled." },
    { status: 410 }
  );
}
