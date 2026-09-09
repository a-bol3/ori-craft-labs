import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LocalizedOffers } from "@/components/landing/localized-offers";
import { isLocale, locales, messages, type Locale } from "@/lib/i18n";

export const dynamic = "force-dynamic";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  return {
    title: messages[locale].offers,
    description: messages[locale].offersText,
    alternates: {
      canonical: locale === "pl" ? "/offers" : `/${locale}/offers`,
      languages: { pl: "/offers", en: "/en/offers", es: "/es/offers" },
    },
    openGraph: { locale: messages[locale].lang, url: `https://ori-craftlabs.com${locale === "pl" ? "/offers" : `/${locale}/offers`}` },
  };
}

export default async function LocalizedOffersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <LocalizedOffers locale={locale as Locale} />;
}
