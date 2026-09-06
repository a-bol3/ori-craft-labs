// src/app/api/admin/insights/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";

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

  const safePosts = posts.map((p: any) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    category: p.category,
    locale: p.locale,
    excerpt: p.excerpt,
    content: p.content,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
    createdAt: p.createdAt ? p.createdAt.toISOString() : null,
  }));

  return json({ success: true, posts: safePosts });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || (session.user as any).role !== "admin") {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { title, slug, category, locale, excerpt, content } = body || {};

  if (!title || !slug || !excerpt || !content) {
    return json(
      { success: false, error: "Title, slug, excerpt and content are required." },
      { status: 400 }
    );
  }

  await dbConnect();

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
    publishedAt: new Date(),
  });

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
        publishedAt: doc.publishedAt?.toISOString() ?? null,
        createdAt: doc.createdAt?.toISOString() ?? null,
      },
    },
    { status: 201 }
  );
}
