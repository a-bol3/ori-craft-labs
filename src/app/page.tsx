import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { HeroSettings } from "@/lib/models/HeroSettings";
import { Service } from "@/lib/models/Service";
import { Offer } from "@/lib/models/Offer";
import { InsightPost } from "@/lib/models/InsightPost";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/ui/marquee";
import { InfoCard } from "@/components/ui/info-card";
import { GlowingButton } from "@/components/ui/glowing-button";

export const dynamic = "force-dynamic";

const fallbackServices = [
  { title: "Movement & Flow", description: "Taniec, oddech i świadomość ciała", category: "Wellbeing" },
  { title: "Stretch & Relax", description: "Łagodne rozciąganie przy muzyce latino", category: "Relaksacja" },
  { title: "Children Rhythm Lab", description: "Rytm i ruch dla dzieci", category: "Dzieci" },
  { title: "Wieczory kultury", description: "Muzyka, opowieści i wspólne tańce", category: "Kultura" },
  { title: "Corporate Wellness", description: "Dni zdrowia dla zespołów", category: "Firmy" },
  { title: "Warsztaty kulinarne", description: "Kubańskie i latynoskie smaki", category: "Smaki" },
];

export default async function Home() {
  await dbConnect();
  const [hero, services, offers, insights] = await Promise.all([
    HeroSettings.findOne({ locale: "pl", status: "published" }).lean(),
    Service.find({ locale: "pl", isActive: true, status: "published" }).sort({ section: 1, createdAt: 1 }).lean(),
    Offer.find({ locale: "pl", isActive: true, status: "published" }).sort({ order: 1, createdAt: 1 }).lean(),
    InsightPost.find({ locale: "pl", status: "published" }).sort({ publishedAt: -1, createdAt: -1 }).lean(),
  ]);
  const serviceCards = services.length ? services.slice(0, 8).map((item: any) => ({ title: item.title, description: item.shortDescription, category: item.section })) : fallbackServices;
  const offerCards = offers.length ? offers.slice(0, 8).map((item: any) => ({ title: item.title, description: item.value, category: item.group })) : [{ title: "Oferta na życzenie", description: "Doświadczenia dla ludzi, szkół i zespołów.", category: "ORI" }];
  const insightCards = insights.length ? insights.slice(0, 8).map((item: any) => ({ title: item.title, description: item.excerpt, category: item.category })) : [{ title: "Nowe historie już wkrótce", description: "Ruch, rytuały, kultura i codzienność.", category: "Insights" }];

  return <main className="min-h-screen overflow-x-hidden bg-brand selection:bg-cta selection:text-brand">
    <Hero copy={hero ? { titleLine1: hero.titleLine1, titleLine2: hero.titleLine2, subtitle: hero.subtitle, primaryCtaLabel: hero.primaryCtaLabel, primaryCtaHref: hero.primaryCtaHref, secondaryCtaLabel: hero.secondaryCtaLabel, secondaryCtaHref: hero.secondaryCtaHref } : undefined} />
    <section className="border-t border-white/5 bg-black/20 py-24"><div className="container mx-auto mb-16 px-4 text-center"><h2 className="mb-6 text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">Co oferujemy</h2><p className="mx-auto max-w-2xl text-white/70">Ruch, wellness, kultura i smaki zaprojektowane, by pomóc Ci odzyskać kontakt z ciałem i społecznością.</p></div><Marquee direction="left" speed={50}>{serviceCards.map((item, i) => <InfoCard key={`${item.title}-${i}`} title={item.title} description={item.description} category={item.category} link="/services" />)}</Marquee><div className="mt-12 flex justify-center"><GlowingButton href="/services" variant="gold">Pełna oferta</GlowingButton></div></section>
    <section className="border-t border-white/5 py-24"><div className="container mx-auto mb-16 px-4 text-center"><h2 className="mb-6 text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">Pakiety i oferty</h2><p className="mx-auto max-w-2xl text-white/70">Wybierz doświadczenie dla siebie, partnera lub zespołu.</p></div><Marquee direction="right" speed={50}>{offerCards.map((item, i) => <InfoCard key={`${item.title}-${i}`} title={item.title} description={item.description} category={item.category} link="/offers" />)}</Marquee><div className="mt-12 flex justify-center"><GlowingButton href="/offers" variant="gold">Zobacz pakiety</GlowingButton></div></section>
    <section className="border-t border-white/5 bg-black/20 py-24"><div className="container mx-auto mb-16 px-4 text-center"><h2 className="mb-6 text-4xl font-black uppercase tracking-tighter text-white md:text-6xl">Inspiracje i historie</h2><p className="mx-auto max-w-2xl text-white/70">Od krótkich aktualizacji i wydarzeń po rytuały i opowieści kultury.</p></div><Marquee direction="left" speed={60}>{insightCards.map((item, i) => <InfoCard key={`${item.title}-${i}`} title={item.title} description={item.description} category={item.category} link="/insights" />)}</Marquee><div className="mt-12 flex justify-center gap-4"><GlowingButton href="/insights" variant="gold">Czytaj Insights</GlowingButton><Link href="/events" className="rounded-full border border-white/20 px-8 py-4 font-bold text-white hover:bg-white/10">Zobacz wydarzenia</Link></div></section>
    <section className="border-t border-white/5 bg-gradient-to-b from-brand to-black py-32 text-center"><h2 className="mb-8 text-5xl font-black uppercase tracking-tighter text-white md:text-8xl">Porozmawiajmy</h2><p className="mx-auto mb-12 max-w-2xl text-xl font-light text-white/70">Powiedz nam, czego potrzebujesz — spokojnych zajęć, wydarzenia dla zespołu czy czegoś pomiędzy.</p><Link href="/contact" className="inline-block rounded-full bg-cta px-12 py-5 font-black uppercase tracking-widest text-brand shadow-lg shadow-cta/20 transition-colors hover:bg-white">Skontaktuj się z nami</Link></section>
  </main>;
}
