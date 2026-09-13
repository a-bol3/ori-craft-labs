// src/app/api/admin/insights/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";
import { getSessionUser } from "@/lib/auth";
import { latestDraftRevision, recordAudit, recordRevision, revisionPayload } from "@/lib/editorial";

function json(data: any, init?: { status?: number }) {
  return NextResponse.json(data, { status: init?.status ?? 200 });
}

function postResponse(post: any) {
  return {
    id: String(post._id ?? post.id),
    title: post.title,
    slug: post.slug,
    category: post.category,
    locale: post.locale,
    excerpt: post.excerpt,
    content: post.content,
    status: post.status,
    version: post.version,
    publishedAt: post.publishedAt ? new Date(post.publishedAt).toISOString() : null,
    createdAt: post.createdAt ? new Date(post.createdAt).toISOString() : null,
  };
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
  if (Object.keys(patch).length === 0) {
    return json({ success: false, error: "At least one editable field is required." }, { status: 400 });
  }

  const latestDraft = await latestDraftRevision("insight", id);
  const base = latestDraft && Number(latestDraft.version) > Number(current.version ?? 0)
    ? { ...current, ...(latestDraft.payload as Record<string, unknown>) }
    : current;
  const version = Math.max(Number(current.version ?? 1), Number(latestDraft?.version ?? 0)) + 1;
  const next = { ...base, ...patch, status: "draft", version, publishedAt: null, updatedBy: user?.id };

  // Keep the live row untouched while a published post is being edited.
  const updated = current.status === "published"
    ? next
    : await InsightPost.findByIdAndUpdate(id, { ...patch, status: "draft", version, publishedAt: null, updatedBy: user?.id }, { new: true }).lean();
  if (!updated) return json({ success: false, error: "Could not save draft" }, { status: 500 });

  await recordRevision({ entityType: "insight", entityId: id, locale: (updated.locale ?? "pl") as "pl" | "en" | "es", version, status: "draft", payload: revisionPayload(updated), createdBy: user?.id, note: "Saved as draft from CMS" });
  await recordAudit({ actorUserId: user?.id, action: "content.updated", entity: "insight", entityId: id, metadata: { status: "draft" } });
  return json({ success: true, post: postResponse(updated) });
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
  const latestDraft = await latestDraftRevision("insight", id);
  const base = latestDraft && Number(latestDraft.version) > Number(current.version ?? 0)
    ? { ...current, ...(latestDraft.payload as Record<string, unknown>) }
    : current;
  const version = Math.max(Number(current.version ?? 1), Number(latestDraft?.version ?? 0)) + 1;
  const published = await InsightPost.findByIdAndUpdate(id, {
    title: base.title,
    slug: base.slug,
    category: base.category,
    locale: base.locale,
    excerpt: base.excerpt,
    content: base.content,
    status: "published",
    version,
    publishedAt: new Date(),
    updatedBy: user?.id,
  }, { new: true }).lean();
  if (!published) return json({ success: false, error: "Could not publish post" }, { status: 500 });
  await recordRevision({ entityType: "insight", entityId: id, locale: (published.locale ?? "pl") as "pl" | "en" | "es", version, status: "published", payload: revisionPayload(published), createdBy: user?.id, note: "Published from CMS" });
  await recordAudit({ actorUserId: user?.id, action: "content.published", entity: "insight", entityId: id });
  return json({ success: true, post: postResponse(published) });
}

export async function PUT(
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

  const latestDraft = await latestDraftRevision("insight", id);
  const base = latestDraft && Number(latestDraft.version) > Number(current.version ?? 0)
    ? { ...current, ...(latestDraft.payload as Record<string, unknown>) }
    : current;
  const version = Math.max(Number(current.version ?? 1), Number(latestDraft?.version ?? 0)) + 1;
  const unpublished = await InsightPost.findByIdAndUpdate(
    id,
    {
      title: base.title,
      slug: base.slug,
      category: base.category,
      locale: base.locale,
      excerpt: base.excerpt,
      content: base.content,
      status: "draft",
      version,
      publishedAt: null,
      updatedBy: user?.id,
    },
    { new: true }
  ).lean();
  if (!unpublished) return json({ success: false, error: "Could not unpublish post" }, { status: 500 });

  await recordRevision({
    entityType: "insight",
    entityId: id,
    locale: (unpublished.locale ?? "pl") as "pl" | "en" | "es",
    version,
    status: "draft",
    payload: revisionPayload(unpublished),
    createdBy: user?.id,
    note: "Unpublished from CMS",
  });
  await recordAudit({
    actorUserId: user?.id,
    action: "content.unpublished",
    entity: "insight",
    entityId: id,
  });

  return json({ success: true, post: postResponse(unpublished) });
}
