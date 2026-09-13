// src/app/api/admin/insights/route.ts
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

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

  const posts = await InsightPost.find().sort({ createdAt: -1 }).lean();

  const safePosts = await Promise.all(
    posts.map(async (p: any) => {
      const draft = await latestDraftRevision("insight", p._id.toString());
      const value = draft && Number(draft.version) > Number(p.version ?? 0)
        ? { ...p, ...(draft.payload as Record<string, unknown>), status: draft.status, version: draft.version, publishedAt: null }
        : p;

      return {
        id: value._id.toString(),
        title: value.title,
        slug: value.slug,
        category: value.category,
        locale: value.locale,
        excerpt: value.excerpt,
        content: value.content,
        status: value.status,
        version: value.version,
        publishedAt: value.publishedAt ? value.publishedAt.toISOString() : null,
        createdAt: value.createdAt ? value.createdAt.toISOString() : null,
      };
    })
  );

  return json({ success: true, posts: safePosts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { title, slug, category, locale, excerpt, content } = body || {};

  if (!title || !slug || !excerpt || !content || !["pl", "en", "es"].includes(locale)) {
    return json(
      { success: false, error: "Title, slug, excerpt and content are required." },
      { status: 400 }
    );
  }

  await dbConnect();
  const user = await getSessionUser();

  const existing = await InsightPost.findOne({ slug });
  if (existing) {
    return json(
      { success: false, error: "Slug already exists. Choose another one." },
      { status: 409 }
    );
  }

  const doc = await InsightPost.create({
    title,
    slug,
    category: category || "movement",
    locale: locale || "pl",
    excerpt,
    content,
    status: "draft",
    version: 1,
    publishedAt: null,
    updatedBy: user?.id,
  });

  await recordRevision({ entityType: "insight", entityId: String(doc._id), locale, version: 1, status: "draft", payload: revisionPayload(doc as unknown as Record<string, unknown>), createdBy: user?.id, note: "Created from CMS" });
  await recordAudit({ actorUserId: user?.id, action: "content.created", entity: "insight", entityId: String(doc._id), metadata: { locale } });

  return json(
    {
      success: true,
      post: {
        id: doc._id.toString(),
        title: doc.title,
        slug: doc.slug,
        category: doc.category,
        locale: doc.locale,
        excerpt: doc.excerpt,
        content: doc.content,
        status: doc.status,
        version: doc.version,
        publishedAt: doc.publishedAt?.toISOString() ?? null,
        createdAt: doc.createdAt?.toISOString() ?? null,
      },
    },
    { status: 201 }
  );
}
