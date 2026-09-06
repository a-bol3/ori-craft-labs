// src/app/dashboard/admin/messages/page.tsx
import { dbConnect } from "@/lib/db";
import { ContactRequest } from "@/lib/models/ContactRequest";

function formatDateTime(date: Date | string | undefined) {
  if (!date) return "-";
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleString("pl-PL", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function AdminMessagesPage() {
  await dbConnect();

  const raw = await ContactRequest.find().sort({ createdAt: -1 }).lean();

  const messages = raw.map((m: any) => ({
    id: m._id.toString(),
    name: m.name,
    email: m.email,
    subject: m.subject,
    message: m.message,
    createdAt: m.createdAt ? m.createdAt.toISOString() : "",
  }));

  return (
    <section className="space-y-6">
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Messages</h2>
        <p className="text-white/70 font-body">
          All messages sent from the contact form on the website.
        </p>
      </div>

      {messages.length === 0 ? (
        <p className="text-sm text-white/70 font-body">
          No messages yet. Once someone writes through the contact form, their
          message will appear here.
        </p>
      ) : (
        <div className="space-y-4">
          {messages.map((m) => (
            <article
              key={m.id}
              className="rounded-3xl border border-white/10 bg-black/30 p-4 md:p-5 shadow-lg shadow-black/40"
            >
              <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
                <div>
                  <h3 className="text-base font-heading font-semibold">
                    {m.subject || "No subject"}
                  </h3>
                  <p className="text-xs text-white/60 font-body">
                    From:{" "}
                    <span className="font-medium text-white">
                      {m.name || "-"}
                    </span>{" "}
                    &lt;{m.email}&gt;
                  </p>
                </div>
                <p className="text-xs text-white/50 font-body">
                  {formatDateTime(m.createdAt)}
                </p>
              </header>
              <p className="text-sm text-white/80 font-body whitespace-pre-line">
                {m.message}
              </p>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
