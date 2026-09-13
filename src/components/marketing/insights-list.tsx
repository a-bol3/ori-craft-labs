import Link from "next/link";
import CommonVideoHeader from "@/components/ui/common-video-header";
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";
import { messages, type Locale } from "@/lib/i18n";
import { localizedPath } from "@/lib/locale-routing";

const dateLocales: Record<Locale, string> = {
  pl: "pl-PL",
  en: "en-GB",
  es: "es-ES",
};

export async function InsightsList({ locale }: { locale: Locale }) {
  await dbConnect();
  const raw = await InsightPost.find({ locale, status: "published" })
    .sort({ publishedAt: -1, createdAt: -1 })
    .lean();
  const copy = messages[locale].insightsPage;

  return (
    <main className="relative min-h-screen overflow-hidden bg-brand pb-16 pt-24">
      <CommonVideoHeader />
      <div className="container relative z-10 mx-auto px-8">
        <h1 className="mb-16 text-center font-display text-5xl font-black uppercase tracking-tight text-cta md:text-7xl">
          {copy.title}
        </h1>

        {raw.length === 0 ? (
          <p className="font-body text-white/70">{copy.empty}</p>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {raw.map((post: any) => {
              const date = post.publishedAt
                ? new Date(post.publishedAt).toLocaleDateString(dateLocales[locale], {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })
                : "";
              const category = copy.categories[post.category] ?? post.category;

              return (
                <article
                  key={post.slug}
                  className="flex flex-col justify-between rounded-3xl border border-white/15 bg-black/50 p-6 shadow-xl shadow-black/60"
                >
                  <div>
                    <p className="mb-3 font-heading text-xs uppercase tracking-widest text-cta">
                      {category}
                    </p>
                    <h2 className="mb-3 font-display text-xl font-semibold text-white">
                      {post.title}
                    </h2>
                    {date && <p className="mb-2 font-body text-xs text-white/60">{date}</p>}
                    <p className="mb-8 flex-1 font-body text-white/70">{post.excerpt}</p>
                  </div>
                  <Link
                    href={localizedPath(`/insights/${post.slug}`, locale)}
                    className="inline-flex w-fit items-center rounded-full border border-white/30 px-4 py-2 font-heading text-xs uppercase tracking-widest text-white transition-colors hover:border-cta hover:text-cta"
                  >
                    {copy.readMore}
                  </Link>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
