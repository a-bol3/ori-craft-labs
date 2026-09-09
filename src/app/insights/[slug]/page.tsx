import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const post = await InsightPost.findOne({ slug, locale: "pl", status: "published" }).lean();
  if (!post) return {};
  return { title: post.title, description: post.excerpt, alternates: { canonical: `/insights/${slug}` }, openGraph: { title: post.title, description: post.excerpt, type: "article" } };
}

export default async function InsightDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  const post = await InsightPost.findOne({ slug, locale: "pl", status: "published" }).lean();
  if (!post) notFound();
  const paragraphs = String(post.content).split(/\n\s*\n/).filter(Boolean);
  return (
    <main className="min-h-screen bg-brand px-6 pb-24 pt-40 text-white">
      <article className="mx-auto max-w-3xl">
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
