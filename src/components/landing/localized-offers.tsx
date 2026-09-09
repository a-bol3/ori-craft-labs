import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { Offer } from "@/lib/models/Offer";
import type { Locale } from "@/lib/i18n";

const copy = {
  pl: {
    eyebrow: "ORI Craft Labs",
    title: "Oferta i pakiety",
    intro: "Wybierz doświadczenie dla siebie, partnera lub zespołu.",
    contact: "Skontaktuj się",
    value: "Wartość",
    idealFor: "Idealne dla",
    empty: "Aktualnie przygotowujemy tę ofertę.",
  },
  en: {
    eyebrow: "ORI Craft Labs",
    title: "Offers and packages",
    intro: "Choose an experience for yourself, your partner or your team.",
    contact: "Get in touch",
    value: "Value",
    idealFor: "Ideal for",
    empty: "This offer is currently being prepared.",
  },
  es: {
    eyebrow: "ORI Craft Labs",
    title: "Ofertas y paquetes",
    intro: "Elige una experiencia para ti, tu pareja o tu equipo.",
    contact: "Contactar",
    value: "Valor",
    idealFor: "Ideal para",
    empty: "Esta oferta se está preparando actualmente.",
  },
} as const;

export async function LocalizedOffers({ locale }: { locale: Locale }) {
  const labels = copy[locale];
  await dbConnect();
  const offers = await Offer.find({ locale, isActive: true, status: "published" })
    .sort({ order: 1, createdAt: 1 })
    .lean();

  return (
    <main className="min-h-screen bg-brand px-6 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-6 text-sm uppercase tracking-[.3em] text-secondary">
          {labels.eyebrow}
        </p>
        <h1 className="mb-6 text-5xl font-black uppercase md:text-7xl">
          {labels.title}
        </h1>
        <p className="mb-12 max-w-2xl text-xl leading-relaxed text-white/75">
          {labels.intro}
        </p>

        {offers.length === 0 ? (
          <p className="text-white/70">{labels.empty}</p>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {offers.map((offer: any) => (
              <article
                key={offer._id}
                className="flex flex-col justify-between rounded-3xl border border-white/10 bg-white/5 p-6"
              >
                <div>
                  {offer.subtitle && (
                    <p className="mb-3 text-xs uppercase tracking-widest text-secondary">
                      {offer.subtitle}
                    </p>
                  )}
                  <h2 className="mb-4 text-2xl font-bold">{offer.title}</h2>
                  {(offer.priceFrom || offer.duration) && (
                    <p className="mb-4 text-xl font-black text-cta">
                      {offer.priceFrom}
                      {offer.duration && (
                        <span className="block text-xs font-medium text-white/60">
                          {offer.duration}
                        </span>
                      )}
                    </p>
                  )}
                  {Array.isArray(offer.includes) && offer.includes.length > 0 && (
                    <ul className="mb-4 space-y-2 text-sm text-white/80">
                      {offer.includes.map((item: string) => (
                        <li key={item} className="flex gap-2">
                          <span className="text-cta">✓</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {offer.value && (
                    <p className="mb-2 text-sm text-white/80">
                      <strong className="mr-1 text-xs uppercase text-white/60">
                        {labels.value}:
                      </strong>
                      {offer.value}
                    </p>
                  )}
                  {offer.idealFor && (
                    <p className="text-sm text-white/80">
                      <strong className="mr-1 text-xs uppercase text-white/60">
                        {labels.idealFor}:
                      </strong>
                      {offer.idealFor}
                    </p>
                  )}
                </div>
                <Link
                  href={`/${locale}/contact`}
                  className="mt-8 inline-flex justify-center rounded-full bg-cta px-6 py-3 text-sm font-bold uppercase tracking-wide text-brand"
                >
                  {labels.contact}
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
