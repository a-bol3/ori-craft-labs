// src/app/dashboard/admin/newsletter/page.tsx
import { dbConnect } from "@/lib/db";
import { NewsletterSubscriber } from "@/lib/models/NewsletterSubscriber";

function formatDate(date: Date | string | undefined) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

export default async function AdminNewsletterPage() {
  await dbConnect();

  const raw = await NewsletterSubscriber.find().sort({ createdAt: -1 }).lean();

  const subscribers = raw.map((s: any) => ({
    id: s._id.toString(),
    email: s.email,
    createdAt: s.createdAt ? s.createdAt.toISOString() : "",
  }));

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Newsletter</h2>
        <p className="text-white/70 font-body">
          All emails subscribed via the newsletter form in the footer.
        </p>
      </div>

      {subscribers.length === 0 ? (
        <p className="text-sm text-white/70 font-body">
          No subscribers yet. Once people start signing up, their emails will
          appear here.
        </p>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4 md:p-6 shadow-xl shadow-black/50 overflow-x-auto">
          <table className="min-w-full text-sm font-body">
            <thead>
              <tr className="text-left text-xs uppercase tracking-widest text-white/60 border-b border-white/10">
                <th className="py-2 pr-4">Email</th>
                <th className="py-2 pr-4">Subscribed on</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s) => (
                <tr
                  key={s.id}
                  className="border-b border-white/5 last:border-b-0 hover:bg-white/5"
                >
                  <td className="py-2 pr-4 text-white/80">{s.email}</td>
                  <td className="py-2 pr-4 text-white/60">
                    {formatDate(s.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
