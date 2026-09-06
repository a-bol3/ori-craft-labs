// src/app/dashboard/admin/cms/insights/page.tsx
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";
import { InsightsManager } from "@/components/admin/InsightsManager";

export default async function CmsInsightsPage() {
  await dbConnect();

  const raw = await InsightPost.find().sort({ createdAt: -1 }).lean();

  const posts = raw.map((p: any) => ({
    id: p._id.toString(),
    title: p.title,
    slug: p.slug,
    category: p.category,
    locale: p.locale,
    excerpt: p.excerpt,
    content: p.content,
    publishedAt: p.publishedAt ? p.publishedAt.toISOString() : null,
  }));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold mb-2">
          CMS - Insights / Blog
        </h1>
        <p className="text-white/70 font-body">
          Manage short articles and reflections for the “Aktualności /
          Insights” section. Create, edit and delete posts for your audience.
        </p>
      </div>

      <InsightsManager initialPosts={posts} />
    </section>
  );
}
