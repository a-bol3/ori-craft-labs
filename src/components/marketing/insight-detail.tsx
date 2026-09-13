import { notFound } from "next/navigation";
import { getPreviewInsight, getPublishedInsight } from "@/lib/insights";
import { messages, type Locale } from "@/lib/i18n";

export async function InsightDetail({
  locale,
  slug,
  preview,
}: {
  locale: Locale;
  slug: string;
  preview?: string;
}) {
  const wantsPreview = preview === "1";
  const post = wantsPreview
    ? await getPreviewInsight(slug, locale)
    : await getPublishedInsight(slug, locale);
  if (!post) notFound();

  const copy = messages[locale].insightsPage;
  const category = copy.categories[post.category] ?? post.category;
  const paragraphs = String(post.content).split(/\n\s*\n/).filter(Boolean);

  return (
    <main className="min-h-screen bg-brand px-6 pb-24 pt-40 text-white">
      <article className="mx-auto max-w-3xl">
        {wantsPreview && (
          <div className="mb-8 rounded-xl border border-cta/40 bg-cta/10 px-4 py-3 text-sm text-cta">
            {copy.privatePreview}
          </div>
        )}
        <p className="mb-6 text-sm uppercase tracking-[.3em] text-secondary">{category}</p>
        <h1 className="mb-8 text-5xl font-black leading-tight md:text-7xl">{post.title}</h1>
        <p className="mb-12 text-xl leading-relaxed text-white/75">{post.excerpt}</p>
        <div className="space-y-6 text-lg leading-8 text-white/85">
          {paragraphs.map((paragraph: string, index: number) => <p key={index}>{paragraph}</p>)}
        </div>
      </article>
    </main>
  );
}

export async function getInsightMetadata(slug: string, locale: Locale) {
  const post = await getPublishedInsight(slug, locale);
  if (!post) return {};
  const canonical = locale === "pl" ? `/insights/${slug}` : `/${locale}/insights/${slug}`;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical },
    openGraph: { title: post.title, description: post.excerpt, type: "article" as const, locale },
  };
}
