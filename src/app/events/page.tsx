import Link from "next/link";
import { dbConnect } from "@/lib/db";
import { Event } from "@/lib/models/Event";

export const dynamic = "force-dynamic";

export default async function EventsPage() {
  await dbConnect();
  const events = await Event.find({ locale: "pl", status: "published" }).sort({ startsAt: 1 }).lean();
  return (
    <main className="min-h-screen bg-brand px-6 pb-24 pt-40 text-white">
      <div className="mx-auto max-w-6xl">
        <p className="mb-6 text-sm uppercase tracking-[.3em] text-secondary">ORI Craft Labs</p>
        <h1 className="mb-6 text-5xl font-black uppercase md:text-7xl">Ewenty</h1>
        <p className="mb-12 max-w-2xl text-xl leading-relaxed text-white/75">Warsztaty i spotkania wokół ruchu, oddechu, świadomości, smaku i kultury.</p>
        {events.length === 0 ? <p className="text-white/70">Wkrótce pojawią się nowe wydarzenia.</p> : <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">{events.map((event: any) => <Link key={event._id} href={`/events/${event.slug}`} className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:bg-white/10"><p className="mb-3 text-xs uppercase tracking-widest text-secondary">{event.category}</p><h2 className="mb-4 text-2xl font-bold">{event.title}</h2><p className="text-white/75">{event.excerpt}</p><span className="mt-6 inline-block text-sm font-bold text-cta">Przejdź →</span></Link>)}</div>}
      </div>
    </main>
  );
}
