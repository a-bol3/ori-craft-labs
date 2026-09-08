import { NextResponse } from "next/server";
import { dbHealth } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const database = await dbHealth();
  return NextResponse.json({
    status: database ? "ok" : "degraded",
    service: "ori-craft-labs",
    version: process.env.APP_VERSION || "development",
    database: database ? "ok" : "unavailable",
    timestamp: new Date().toISOString(),
  }, { status: database ? 200 : 503 });
}
