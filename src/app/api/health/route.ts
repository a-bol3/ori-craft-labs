import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "ori-craft-labs",
    version: process.env.APP_VERSION || "development",
    timestamp: new Date().toISOString(),
  });
}
