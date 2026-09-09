import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { HeroSettings } from "@/lib/models/HeroSettings";
import { Service } from "@/lib/models/Service";
import { Offer } from "@/lib/models/Offer";
import { InsightPost } from "@/lib/models/InsightPost";
import { GlowingButton } from "@/components/ui/glowing-button";
import { locales, messages, type Locale } from "@/lib/i18n";

export async function LocalizedHome({ locale }: { locale: Locale }) {
  const copy = messages[locale];
  await dbConnect();
  const [hero, services, offers, insights] = await Promise.all([
    HeroSettings.findOne({ locale, status: "published" }).lean(),
    Service.find({ locale, isActive: true, status: "published" }).sort({ section: 1, createdAt: 1 }).lean(),
    Offer.find({ locale, isActive: true, status: "published" }).sort({ order: 1, createdAt: 1 }).lean(),
    InsightPost.find({ locale, status: "published" }).sort({ publishedAt: -1, createdAt: -1 }).lean(),
  ]);
  const cards = [
    [copy.services, services[0]?.shortDescription || copy.servicesText, "Wellness", "services"],
    [copy.offers, offers[0]?.value || copy.offersText, "Culture", "offers"],
    [copy.about, insights[0]?.excerpt || copy.aboutText, "Community", "about"],
  ] as const;
  const titleLine1 = hero?.titleLine1 || copy.tagline;
  const titleLine2 = hero?.titleLine2 || "ORI Craft Labs";
  const subtitle = hero?.subtitle || copy.description;

  return (
    <main className="min-h-screen bg-brand text-white selection:bg-cta selection:text-brand">
      <section className="relative flex min-h-[86vh] flex-col items-center justify-center overflow-hidden px-6 pt-24 text-center">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(220,52,134,.45),transparent_40%),linear-gradient(135deg,#170b21,#4d145b_50%,#e79767)]" />
        <div className="relative z-10 max-w-4xl">
          <p className="mb-6 text-sm font-bold uppercase tracking-[.35em] text-secondary">Wellness · Culture · Food</p>
          <h1 className="mb-8 text-5xl font-black uppercase tracking-tight md:text-8xl">{titleLine1}<br />{titleLine2}</h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg text-white/80 md:text-xl">{subtitle}</p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <GlowingButton href={`/${locale}/services`} innerClassName="text-lg px-8 py-4">{copy.explore}</GlowingButton>
            <Link href={`/${locale}/contact`} className="rounded-full border border-white/30 px-8 py-4 font-bold hover:bg-white/10">{copy.contact}</Link>
          </div>
        </div>
      </section>
      <section className="container mx-auto grid max-w-6xl gap-6 px-6 py-24 md:grid-cols-3">
        {cards.map(([title, text, category, slug]) => (
          <Link key={title} href={slug === "about" ? `/${locale}/about` : `/${locale}/${slug}`} className="rounded-3xl border border-white/10 bg-white/5 p-8 transition hover:bg-white/10">
            <p className="mb-8 text-xs font-bold uppercase tracking-widest text-secondary">{category}</p>
            <h2 className="mb-4 text-3xl font-bold">{title}</h2>
            <p className="text-white/70">{text}</p>
          </Link>
        ))}
      </section>
      <section className="border-t border-white/10 bg-black/20 py-24 text-center">
        <h2 className="mb-8 text-4xl font-black uppercase md:text-7xl">{copy.contact}</h2>
        <Link href={`/${locale}/contact`} className="inline-block rounded-full bg-cta px-10 py-4 font-black uppercase tracking-widest text-brand">{copy.contact}</Link>
      </section>
      <div className="flex justify-center gap-4 pb-16 text-sm uppercase tracking-widest text-white/60">
        {locales.map((item) => <Link key={item} href={`/${item}`} className={item === locale ? "text-cta" : "hover:text-white"}>{item}</Link>)}
      </div>
    </main>
  );
}
