import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightDetail, getInsightMetadata } from "@/components/marketing/insight-detail";
import { isLocale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  return getInsightMetadata(slug, locale);
}

export default async function LocalizedInsightDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; slug: string }>;
  searchParams: Promise<{ preview?: string }>;
}) {
  const [{ locale, slug }, { preview }] = await Promise.all([params, searchParams]);
  if (!isLocale(locale)) notFound();
  return <InsightDetail locale={locale} slug={slug} preview={preview} />;
}
