import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InsightsList } from "@/components/marketing/insights-list";
import { isLocale, locales, messages } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const canonical = locale === "pl" ? "/insights" : `/${locale}/insights`;
  return {
    title: messages[locale].insightsPage.title,
    alternates: {
      canonical,
      languages: { pl: "/insights", en: "/en/insights", es: "/es/insights" },
    },
    openGraph: { type: "website", locale: messages[locale].lang, url: `https://ori-craftlabs.com${canonical}` },
  };
}

export default async function LocalizedInsightsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <InsightsList locale={locale} />;
}
