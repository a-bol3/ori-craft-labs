import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale, locales, messages } from "@/lib/i18n";

const slugs = ["services", "about", "contact", "insights", "history", "faq", "partners", "legal", "privacy", "terms", "cookies", "cookie-preferences"] as const;

export const dynamic = "force-static";

export function generateStaticParams() {
  return locales.flatMap((locale) => slugs.map((slug) => ({ locale, slug })));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !slugs.includes(slug as (typeof slugs)[number])) return {};
  return { title: messages[locale][slug === "contact" ? "contact" : slug === "about" ? "about" : slug === "services" ? "services" : "offers"], alternates: { canonical: `/${locale}/${slug}` } };
}

export default async function LocalizedSection({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale) || !slugs.includes(slug as (typeof slugs)[number])) notFound();
  const copy = messages[locale];
  const key = slug === "contact" ? "contact" : slug === "about" ? "about" : slug === "services" ? "services" : "about";
  const text = slug === "about" ? copy.aboutText : slug === "services" ? copy.servicesText : copy.description;
  return (
    <main className="min-h-screen bg-brand px-6 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-4xl">
        <p className="mb-6 text-sm uppercase tracking-[.3em] text-secondary">ORI Craft Labs</p>
        <h1 className="mb-8 text-5xl font-black uppercase md:text-7xl">{copy[key]}</h1>
        <p className="max-w-2xl text-xl leading-relaxed text-white/75">{text}</p>
      </div>
    </main>
  );
}
