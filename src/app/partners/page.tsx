import CommonVideoHeader from "../../components/ui/common-video-header";
import { Card } from "../../components/ui/card";
import { dbConnect } from "../../lib/db";
import { Partner } from "../../lib/models/Partner";

export const dynamic = "force-dynamic";

export const revalidate = 120;

export default async function PartnersPage() {
  await dbConnect();
  const partners = await Partner.find({ locale: "pl", isActive: true })
    .sort({ order: 1 })
    .lean();

  return (
    <main className="min-h-screen bg-brand pt-24 pb-16 relative overflow-hidden">
      <CommonVideoHeader />
      <div className="container mx-auto px-6 md:px-8 relative z-10">
        <h1 className="text-5xl md:text-6xl font-black text-cta mb-10 uppercase font-display tracking-tight">
          Partnerzy i współpracownicy
        </h1>
        <p className="max-w-3xl text-white/70 mb-10">
          Współtworzymy doświadczenia ze specjalistami, miejscami i markami,
          które dzielą nasze wartości. To są przestrzenie, w których odbywają
          się nasze wieczory kultury, warsztaty ruchowe i spotkania społeczności.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((p: any) => (
            <Card
              key={p._id}
              className="bg-black/40 border-white/10 p-6 flex flex-col gap-4"
            >
              <div className="flex items-center gap-3">
                {p.logoUrl && (
                  <img
                    src={p.logoUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-full object-cover border border-white/20"
                  />
                )}
                <div>
                  <div className="text-sm uppercase text-secondary tracking-wide">
                    {p.type === "cafe"
                      ? "Lokalna kawiarnia"
                      : p.type === "physio"
                      ? "Gabinet fizjoterapii"
                      : p.type === "culture-space"
                      ? "Przestrzeń kultury"
                      : "Partner"}
                  </div>
                  <div className="text-xl font-semibold text-white">
                    {p.name}
                  </div>
                </div>
              </div>

              <p className="text-sm text-white/80">{p.description}</p>

              {p.websiteUrl && (
                <a
                  href={p.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-auto inline-flex items-center text-xs font-semibold uppercase tracking-wide text-cta hover:text-cta/80"
                >
                  Odwiedź stronę &rarr;
                </a>
              )}
            </Card>
          ))}

          {partners.length === 0 && (
            <p className="text-white/60 text-sm">
              Jeszcze nie dodaliśmy partnerów – pojawią się tutaj, gdy tylko
              potwierdzimy pierwsze współprace.
            </p>
          )}
        </div>
      </div>
    </main>
  );
}
