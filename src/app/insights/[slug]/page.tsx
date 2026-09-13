import type { Metadata } from "next";
import { InsightDetail, getInsightMetadata } from "@/components/marketing/insight-detail";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  return getInsightMetadata(slug, "pl");
}

export default async function PolishInsightDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const [{ slug }, { preview }] = await Promise.all([params, searchParams]);
  return <InsightDetail locale="pl" slug={slug} preview={preview} />;
}
