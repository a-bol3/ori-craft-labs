// src/app/dashboard/admin/cms/services/page.tsx
import { dbConnect } from "@/lib/db";
import { Service } from "@/lib/models/Service";
import { ServicesManager, ServiceDTO } from "@/components/admin/ServicesManager";

export default async function CmsServicesPage() {
  await dbConnect();

  const docs = await Service.find({ locale: "pl" })
    .sort({ section: 1, title: 1 })
    .lean();

  const services: ServiceDTO[] = docs.map((s: any) => ({
    id: s._id.toString(),
    locale: s.locale,
    section: s.section,
    title: s.title,
    subtitle: s.subtitle,
    slug: s.slug,
    shortDescription: s.shortDescription,
    valueSummary: s.valueSummary,
    priceFrom: s.priceFrom || "",
    duration: s.duration || "",
    bullets: s.bullets || [],
    isActive: !!s.isActive,
  }));

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-heading font-bold mb-2">
          CMS – Services
        </h1>
        <p className="text-white/70 font-body">
          Manage all services that appear on the landing page and Services
          page. Start with Polish content; later we can extend each service
          with EN / ES translations.
        </p>
      </div>

      <ServicesManager initialServices={services} />
    </section>
  );
}
