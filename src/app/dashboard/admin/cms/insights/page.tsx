// src/app/dashboard/admin/cms/insights/page.tsx
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";
import { InsightsManager } from "@/components/admin/InsightsManager";
import { latestDraftRevision } from "@/lib/editorial";

export default async function CmsInsightsPage() {
  await dbConnect();

  const raw = await InsightPost.find().sort({ createdAt: -1 }).lean();

  const posts = await Promise.all(
    raw.map(async (p: any) => {
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
      };
    })
  );

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
