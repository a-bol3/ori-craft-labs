import CommonVideoHeader from "../../components/ui/common-video-header";
import Link from "next/link";
import { Card } from "../../components/ui/card";
import { dbConnect } from "../../lib/db";
import { Offer, OfferGroup } from "../../lib/models/Offer";

export const dynamic = "force-dynamic";

export const revalidate = 60;

const GROUP_ORDER: OfferGroup[] = [
  "children-youth",
  "adults",
  "corporate",
  "cooking-tasting",
  "culture-evening",
  "team-offsite",
  "retreats",
];

const GROUP_TITLES: Record<OfferGroup, string> = {
  "children-youth": "Children Rhythm Lab – Dzieci i młodzież",
  adults: "Adults – Move & Relax",
  corporate: "Corporate / Firmy i instytucje",
  "cooking-tasting": "Cooking & Tasting",
  "culture-evening": "Culture Evening",
  "team-offsite": "Team Offsite Package",
  retreats: "Wyjazdy i warsztaty (Retreats)",
};

export default async function OffersPage() {
  await dbConnect();
  const offers = await Offer.find({ locale: "pl", isActive: true })
    .sort({ group: 1, order: 1 })
    .lean();

  const grouped = new Map<OfferGroup, any[]>();
  offers.forEach((o: any) => {
    const g = o.group as OfferGroup;
    if (!grouped.has(g)) grouped.set(g, []);
    grouped.get(g)!.push(o);
  });

  return (
    <main className="min-h-screen bg-brand pt-24 pb-16 relative overflow-hidden">
      <CommonVideoHeader />
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <h1 className="text-5xl md:text-7xl font-black text-cta mb-16 uppercase font-display tracking-tight text-center">
          Oferta i pakiety
        </h1>

        <p className="max-w-3xl mx-auto text-center text-white/70 mb-12">
          Wybierz plan pasujący do Twojego rytmu – solo, w parze lub dla Twojego
          zespołu. Wszystkie poniższe karty możesz w pełni edytować w panelu
          CMS.
        </p>

        <div className="space-y-16">
          {GROUP_ORDER.map((groupKey) => {
            const items = grouped.get(groupKey);
            if (!items || items.length === 0) return null;

            return (
              <section key={groupKey}>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">
                  {GROUP_TITLES[groupKey]}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((o: any) => (
                    <Card
                      key={o._id}
                      className="bg-black/40 border-white/10 p-6 flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="text-xs uppercase tracking-wide text-secondary">
                          {o.subtitle}
                        </div>
                        <div className="text-2xl font-semibold text-white">
                          {o.title}
                        </div>

                        {(o.priceFrom || o.duration) && (
                          <div className="text-3xl font-black text-cta mt-2 mb-2">
                            {o.priceFrom}
                            {o.duration && (
                              <span className="block text-xs font-medium text-white/60 mt-1">
                                {o.duration}
                              </span>
                            )}
                          </div>
                        )}

                        {o.includes && o.includes.length > 0 && (
                          <ul className="space-y-1 text-sm text-white/80 mt-4">
                            {o.includes.map(
                              (line: string, idx: number) => (
                                <li key={idx} className="flex gap-2">
                                  <span className="mt-1 text-cta">✓</span>
                                  <span>{line}</span>
                                </li>
                              )
                            )}
                          </ul>
                        )}

                        <div className="mt-4 text-sm text-white/80 space-y-2">
                          {o.value && (
                            <p>
                              <span className="font-semibold uppercase text-xs text-white/60">
                                Wartość:&nbsp;
                              </span>
                              {o.value}
                            </p>
                          )}
                          {o.idealFor && (
                            <p>
                              <span className="font-semibold uppercase text-xs text-white/60">
                                Idealne dla:&nbsp;
                              </span>
                              {o.idealFor}
                            </p>
                          )}
                        </div>
                        {o.notes && (
                          <p className="mt-3 text-xs text-white/60">
                            {o.notes}
                          </p>
                        )}
                      </div>

                      <div className="mt-6">
                        <Link
                          href="/contact"
                          className="inline-flex justify-center items-center rounded-full bg-accent px-6 py-2 text-xs font-semibold uppercase tracking-wide text-brand hover:bg-accent/80 transition"
                        >
                          Kontaktuj się
                        </Link>
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
