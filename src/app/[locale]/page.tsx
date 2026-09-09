import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedHome } from "@/components/landing/localized-home";
import { isLocale, locales, messages, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: messages[locale].tagline,
    description: messages[locale].description,
    alternates: {
      canonical: locale === "pl" ? "/" : `/${locale}`,
      languages: { pl: "/", en: "/en", es: "/es" },
    },
    openGraph: { locale: messages[locale].lang, url: `https://ori-craftlabs.com${locale === "pl" ? "/" : `/${locale}`}` },
  };
}

export default async function LocaleHome({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LocalizedHome locale={locale as Locale} />;
}
