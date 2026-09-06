// src/app/dashboard/admin/cms/hero/page.tsx
import { dbConnect } from "@/lib/db";
import { HeroSettings } from "@/lib/models/HeroSettings";
import { HeroEditor, HeroConfig } from "@/components/admin/HeroEditor";

export default async function CmsHeroPage() {
  await dbConnect();

  let doc = await HeroSettings.findOne({ locale: "pl" }).lean();

  if (!doc) {
    doc = (
      await HeroSettings.create({
        locale: "pl",
        titleLine1: "Poczuj rytm.",
        titleLine2: "Żyj kulturą.",
        subtitle:
          "Ori Craft Labs to ciepła przestrzeń, gdzie latynoski ruch, świadomość ciała, kubańsko-polskie smaki i wspólne rytuały łączą się w jedno doświadczenie.",
        primaryCtaLabel: "Rozpocznij podróż",
        primaryCtaHref: "#oferta",
        secondaryCtaLabel: "Zobacz ofertę",
        secondaryCtaHref: "#oferta",
      })
    ).toObject();
  }

  const hero: HeroConfig = {
    locale: doc.locale as any,
    titleLine1: doc.titleLine1,
    titleLine2: doc.titleLine2,
    subtitle: doc.subtitle,
    primaryCtaLabel: doc.primaryCtaLabel,
    primaryCtaHref: doc.primaryCtaHref,
    secondaryCtaLabel: doc.secondaryCtaLabel,
    secondaryCtaHref: doc.secondaryCtaHref,
  };

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold mb-2">
          CMS - Hero & Banner
        </h1>
        <p className="text-white/70 font-body">
          Update the main hero content shown on the landing page. Later we can
          add English and Spanish versions to the same panel.
        </p>
      </div>

      <HeroEditor initialHero={hero} />
    </section>
  );
}
