// src/app/api/admin/insights/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";
import { getSessionUser } from "@/lib/auth";
import { recordAudit, recordRevision, revisionPayload } from "@/lib/editorial";

function json(data: any, init?: { status?: number }) {
  return NextResponse.json(data, { status: init?.status ?? 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));

  await dbConnect();
  const user = await getSessionUser();
  const current = await InsightPost.findById(id).lean();
  if (!current) return json({ success: false, error: "Not found" }, { status: 404 });
  const allowed = ["title", "slug", "category", "locale", "excerpt", "content"];
  const patch = Object.fromEntries(Object.entries(body || {}).filter(([key]) => allowed.includes(key)));
  const version = Number(current.version ?? 1) + 1;
  const updated = await InsightPost.findByIdAndUpdate(id, { ...patch, status: "draft", version, publishedAt: null, updatedBy: user?.id }, { new: true }).lean();
  await recordRevision({ entityType: "insight", entityId: id, locale: (updated.locale ?? "pl") as "pl" | "en" | "es", version, status: "draft", payload: revisionPayload(updated), createdBy: user?.id, note: "Saved as draft from CMS" });
  await recordAudit({ actorUserId: user?.id, action: "content.updated", entity: "insight", entityId: id, metadata: { status: "draft" } });
  return json({ success: true, post: updated });
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await dbConnect();
  const user = await getSessionUser();
  const current = await InsightPost.findById(id).lean();
  if (!current) return json({ success: false, error: "Not found" }, { status: 404 });
  await InsightPost.findByIdAndUpdate(id, { status: "archived", publishedAt: null, updatedBy: user?.id });
  await recordAudit({ actorUserId: user?.id, action: "content.archived", entity: "insight", entityId: id });

  return json({ success: true });
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") return json({ success: false, error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  await dbConnect();
  const user = await getSessionUser();
  const current = await InsightPost.findById(id).lean();
  if (!current) return json({ success: false, error: "Not found" }, { status: 404 });
  const version = Number(current.version ?? 1) + 1;
  const published = await InsightPost.findByIdAndUpdate(id, { status: "published", version, publishedAt: new Date(), updatedBy: user?.id }, { new: true }).lean();
  await recordRevision({ entityType: "insight", entityId: id, locale: (published.locale ?? "pl") as "pl" | "en" | "es", version, status: "published", payload: revisionPayload(published), createdBy: user?.id, note: "Published from CMS" });
  await recordAudit({ actorUserId: user?.id, action: "content.published", entity: "insight", entityId: id });
  return json({ success: true, post: published });
}
