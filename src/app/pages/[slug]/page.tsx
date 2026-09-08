// src/app/pages/[slug]/page.tsx
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Page } from "@/lib/models/Page";
import CommonVideoHeader from "@/components/ui/common-video-header";

export const dynamic = "force-dynamic";

type Props = {
  params: {
    slug: string;
  };
};

export const revalidate = 60;

export default async function DynamicContentPage({ params }: Props) {
  await dbConnect();

  // Keep it forgiving: only filter by slug.
  // (Locale/status are handled by CMS, but we won't block rendering if they differ.)
  const page = await Page.findOne({ slug: params.slug }).lean();

  if (!page) {
    notFound();
  }

  const safeLead = page.lead || "";
  const safeContent = page.mainContent || "";

  return (
    <main className="min-h-screen bg-brand pt-24 pb-16 relative overflow-hidden">
      <CommonVideoHeader />

      <div className="container mx-auto px-6 md:px-8 relative z-10">
        {/* Page title */}
        <h1 className="text-4xl md:text-6xl font-black text-cta mb-8 uppercase font-display tracking-tight">
          {page.title}
        </h1>

        {/* Hero */}
        {(page.heroTitle || page.heroSubtitle) && (
          <section className="mb-10">
            {page.heroTitle && (
              <h2 className="text-2xl md:text-3xl font-semibold text-white mb-3">
                {page.heroTitle}
              </h2>
            )}
            {page.heroSubtitle && (
              <p className="text-sm uppercase tracking-wide text-white/50">
                {page.heroSubtitle}
              </p>
            )}
          </section>
        )}

        {/* Lead paragraph */}
        {safeLead && (
          <section className="mb-8">
            <p className="text-lg text-white/80 leading-relaxed max-w-3xl">
              {safeLead}
            </p>
          </section>
        )}

        {/* Main content (simple text block, split by new lines) */}
        {safeContent && (
          <section className="mt-4 max-w-3xl space-y-4 text-white/80 leading-relaxed">
            {safeContent
              .split("\n")
              .filter((line: string) => line.trim().length > 0)
              .map((line: string, idx: number) => (
                <p key={idx}>{line}</p>
              ))}
          </section>
        )}
      </div>
    </main>
  );
}
