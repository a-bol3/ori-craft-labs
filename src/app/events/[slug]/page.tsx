import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { dbConnect } from "@/lib/db";
import { Event } from "@/lib/models/Event";
import { EventRequestForm } from "@/components/marketing/event-request-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  await dbConnect();
  const event = await Event.findOne({ slug, locale: "pl", status: "published" }).lean();
  return event ? { title: event.title, description: event.excerpt, alternates: { canonical: `/events/${slug}` } } : {};
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  await dbConnect();
  const event = await Event.findOne({ slug, locale: "pl", status: "published" }).lean();
  if (!event) notFound();
  const paragraphs = String(event.content).split(/\n\s*\n/).filter(Boolean);
  return (
    <main className="min-h-screen bg-brand px-6 pb-24 pt-40 text-white">
      <article className="mx-auto max-w-4xl">
        <p className="mb-6 text-sm uppercase tracking-[.3em] text-secondary">{event.category}</p>
        <h1 className="mb-8 text-5xl font-black leading-tight md:text-7xl">{event.title}</h1>
        <p className="mb-10 text-xl leading-relaxed text-white/75">{event.excerpt}</p>
        <div className="mb-12 grid gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 text-sm text-white/80 md:grid-cols-3"><p><strong>Data</strong><br />{new Date(event.startsAt).toLocaleString("pl-PL", { dateStyle: "long", timeStyle: "short", timeZone: "Europe/Warsaw" })}</p><p><strong>Miejsce</strong><br />{event.venue || "Szczegóły po zgłoszeniu"}</p><p><strong>Cena</strong><br />{event.price || "Zapytaj o dostępność"}</p></div>
        <div className="mb-12 space-y-6 text-lg leading-8 text-white/85">{paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
        <EventRequestForm eventId={String(event._id)} />
      </article>
    </main>
  );
}
