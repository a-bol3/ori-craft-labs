// src/app/dashboard/admin/page.tsx
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";
import { ContactRequest } from "@/lib/models/ContactRequest";
import { NewsletterSubscriber } from "@/lib/models/NewsletterSubscriber";
import Link from "next/link";

export default async function AdminDashboardPage() {
  await dbConnect();

  const [userCount, contactCount, newsletterCount] = await Promise.all([
    User.countDocuments(),
    ContactRequest.countDocuments(),
    NewsletterSubscriber.countDocuments(),
  ]);

  return (
    <section className="space-y-8">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">
          Panel administratora
        </h2>
        <p className="text-white/70 font-body">
          Szybki podgląd tego, co dzieje się w Ori Craft Labs.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid gap-6 md:grid-cols-3">
        <StatCard
          label="Użytkownicy"
          value={userCount}
          description="Wszyscy zarejestrowani użytkownicy systemu."
        />
        <StatCard
          label="Wiadomości z formularza"
          value={contactCount}
          description="Ile osób napisało przez formularz kontaktowy."
        />
        <StatCard
          label="Subskrybenci newslettera"
          value={newsletterCount}
          description="Adresy zapisane w sekcji newsletter."
        />
      </div>

      {/* Navigation tiles */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <NavTile
          href="/dashboard/admin/users"
          title="Użytkownicy"
          description="Przeglądaj, twórz i aktualizuj konta użytkowników."
        />
        <NavTile
          href="/dashboard/admin/messages"
          title="Wiadomości"
          description="Zobacz wszystkie zgłoszenia z formularza kontaktowego."
        />
        <NavTile
          href="/dashboard/admin/newsletter"
          title="Newsletter"
          description="Zarządzaj listą adresów i wysyłkami."
        />
        <NavTile
          href="/dashboard/admin/cms"
          title="CMS – treści"
          description="Edytuj teksty na stronę: usługi, oferta, inspiracje."
        />
        <NavTile
          href="/dashboard/admin/finance"
          title="Finanse"
          description="Przychody, koszty i proste raporty finansowe."
        />
        <NavTile
          href="/dashboard/admin/settings"
          title="Ustawienia"
          description="Ustawienia globalne, język, konfiguracje."
        />
      </div>
    </section>
  );
}

function StatCard(props: {
  label: string;
  value: number;
  description: string;
}) {
  const { label, value, description } = props;
  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 px-6 py-5 shadow-xl shadow-black/50">
      <p className="text-xs uppercase tracking-widest text-cta font-heading mb-2">
        {label}
      </p>
      <p className="text-4xl font-heading font-bold mb-2">{value}</p>
      <p className="text-sm text-white/70 font-body">{description}</p>
    </div>
  );
}

function NavTile(props: { href: string; title: string; description: string }) {
  const { href, title, description } = props;
  return (
    <Link
      href={href}
      className="group rounded-3xl border border-white/10 bg-black/20 px-6 py-5 shadow-lg shadow-black/40 hover:border-cta hover:bg-black/30 transition-colors flex flex-col justify-between"
    >
      <div>
        <h3 className="text-lg font-heading font-semibold mb-1 group-hover:text-cta">
          {title}
        </h3>
        <p className="text-sm text-white/70 font-body">{description}</p>
      </div>
      <p className="mt-3 text-xs uppercase tracking-widest text-white/50 group-hover:text-cta font-heading">
        Otwórz →
      </p>
    </Link>
  );
}
