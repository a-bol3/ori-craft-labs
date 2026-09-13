import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { latestDraftRevision } from "@/lib/editorial";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const post = await InsightPost.findOne({ slug, locale: "pl", status: "published" }).lean();
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: `/insights/${slug}` }, openGraph: { title: post.title, description: post.excerpt, type: "article" } };
}

export default async function InsightDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const { slug } = await params;
  const { preview } = await searchParams;
  const wantsPreview = preview === "1";
  const session = wantsPreview ? await getServerSession(authOptions) : null;
  const canPreview = session?.user && (session.user as any).role === "admin";

  if (wantsPreview && !canPreview) notFound();

  await dbConnect();
  let post;

  if (wantsPreview) {
    // Draft edits to published posts live in content_revisions, not in the
    // public row. Resolve the effective draft before matching its current slug.
    const candidates = await InsightPost.find({ locale: "pl" }).lean();
    for (const candidate of candidates) {
      if (candidate.status === "archived") continue;

      const draft = await latestDraftRevision("insight", String(candidate._id));
      const effectivePost = draft && Number(draft.version) > Number(candidate.version ?? 0)
        ? {
            ...candidate,
            ...(draft.payload as Record<string, unknown>),
            status: draft.status,
            version: draft.version,
            publishedAt: null,
          }
        : candidate;

      if (
        effectivePost.slug === slug &&
        ["draft", "review", "published"].includes(String(effectivePost.status))
      ) {
        post = effectivePost;
        break;
      }
    }
  } else {
    post = await InsightPost.findOne({ slug, locale: "pl", status: "published" }).lean();
  }

  if (!post) notFound();
  const paragraphs = String(post.content).split(/\n\s*\n/).filter(Boolean);
  return (
    <main className="min-h-screen bg-brand px-6 pb-24 pt-40 text-white">
      <article className="mx-auto max-w-3xl">
        {wantsPreview && (
          <div className="mb-8 rounded-xl border border-cta/40 bg-cta/10 px-4 py-3 text-sm text-cta">
            Private preview — this content is not visible to public visitors.
          </div>
        )}
        <p className="mb-6 text-sm uppercase tracking-[.3em] text-secondary">{post.category}</p>
        <h1 className="mb-8 text-5xl font-black leading-tight md:text-7xl">{post.title}</h1>
        <p className="mb-12 text-xl leading-relaxed text-white/75">{post.excerpt}</p>
        <div className="space-y-6 text-lg leading-8 text-white/85">
          {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        </div>
      </article>
    </main>
  );
}
