import React from "react";
import Link from "next/link";
import CommonVideoHeader from "@/components/ui/common-video-header";
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";

export const dynamic = "force-dynamic";

function formatDate(date: string | null) {
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function InsightsPage() {
  await dbConnect();

  // For now we use only Polish (pl). Later we can add EN/ES.
  const raw = await InsightPost.find({ locale: "pl", status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();

  const postsFromDb = raw.map((p: any) => ({
    id: p._id.toString(),
    title: p.title,
    date: p.publishedAt ? p.publishedAt.toISOString() : null,
    category: p.category,
    excerpt: p.excerpt,
    slug: p.slug,
  }));

  const posts = postsFromDb;

  return (
    <main className="min-h-screen bg-brand pt-24 pb-16 relative overflow-hidden">
      <CommonVideoHeader />
      <div className="container mx-auto px-8 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-cta mb-16 uppercase font-display tracking-tight text-center">
          Aktualności
        </h1>

        {posts.length === 0 ? (
          <p className="text-white/70 font-body">
            Brak wpisów w tej chwili. Wkrótce pojawią się tu nowe historie.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post.slug}
                className="bg-black/50 rounded-3xl border border-white/15 p-6 flex flex-col justify-between shadow-xl shadow-black/60"
              >
                <div>
                  <p className="text-xs uppercase tracking-widest text-cta font-heading mb-3">
                    {post.category}
                  </p>
                  <h2 className="text-xl font-semibold text-white mb-3 font-display">
                    {post.title}
                  </h2>
                  {post.date && (
                    <p className="text-xs text-white/60 mb-2 font-body">
                      {formatDate(
                        typeof post.date === "string" ? post.date : null
                      )}
                    </p>
                  )}
                  <p className="text-white/70 mb-8 flex-1 font-body">
                    {post.excerpt}
                  </p>
                </div>
                <div>
                  <Link
                    href={`/insights/${post.slug}`}
                    className="inline-flex items-center text-xs uppercase tracking-widest text-white border border-white/30 rounded-full px-4 py-2 hover:border-cta hover:text-cta transition-colors font-heading"
                  >
                    Czytaj więcej
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
