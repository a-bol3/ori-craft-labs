"use client";

import { useState } from "react";

export function EventRequestForm({ eventId }: { eventId: string }) {
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">("idle");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("loading");
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: form.get("name"), email: form.get("email"), message: form.get("message"), locale: "pl", eventId, consent: form.get("consent") === "on", website: form.get("website") }) });
    setState(response.ok ? "success" : "error");
    if (response.ok) event.currentTarget.reset();
  }
  return <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-white/10 bg-black/20 p-6"><h2 className="text-2xl font-bold">Zgłoś zainteresowanie</h2><input name="name" required minLength={2} maxLength={120} placeholder="Imię i nazwisko" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white" /><input name="email" type="email" required placeholder="Email" className="rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white" /><textarea name="message" required minLength={10} maxLength={5000} placeholder="Napisz, ile osób planuje udział i o co chcesz zapytać." className="min-h-32 rounded-xl border border-white/15 bg-black/30 px-4 py-3 text-white" /><input name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" /><label className="flex gap-3 text-sm text-white/75"><input name="consent" type="checkbox" required /> Zgadzam się na kontakt w sprawie tego zgłoszenia.</label><button disabled={state === "loading"} className="rounded-full bg-cta px-6 py-3 font-bold text-brand disabled:opacity-50">{state === "loading" ? "Wysyłanie…" : "Wyślij zgłoszenie"}</button>{state === "success" && <p className="text-emerald-300">Dziękujemy. Wrócimy z informacją o dostępności.</p>}{state === "error" && <p className="text-red-300">Nie udało się wysłać zgłoszenia. Spróbuj ponownie.</p>}</form>;
}
