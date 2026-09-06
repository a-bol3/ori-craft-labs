"use client";

import React, { useState } from "react";
import Link from "next/link";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [messageText, setMessageText] = useState<string>("");

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    // ✅ keep a stable reference to the form BEFORE any await
    const form = event.currentTarget;

    setIsSubmitting(true);
    setStatus("idle");
    setMessageText("");

    const formData = new FormData(form);
    const name = String(formData.get("name") || "");
    const email = String(formData.get("email") || "");
    const subject = String(formData.get("subject") || "");
    const message = String(formData.get("message") || "");
    const consent = formData.get("consent") === "on";
    const website = String(formData.get("website") || "");

    try {
        const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, subject, message, consent, website }),
        });

        const data = await res.json().catch(() => ({}));

        console.log("Contact form response:", res.status, data);

        if (data && data.success) {
        setStatus("success");
        setMessageText("Dziękujemy! Twoja wiadomość została wysłana.");

        // ✅ use the saved form reference
        form.reset();
        } else {
        setStatus("error");
        setMessageText(
            (data && data.error) ||
            "Coś poszło nie tak. Spróbuj ponownie później."
        );
        }
    } catch (error) {
        console.error("Contact form fetch error:", error);
        setStatus("error");
        setMessageText("Coś poszło nie tak. Spróbuj ponownie później.");
    } finally {
        setIsSubmitting(false);
    }
    }

  return (
    <main className="min-h-screen bg-brand pt-24 pb-16">
      <div className="container mx-auto px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* LEFT: Info text (unchanged, just like your design) */}
          <div className="flex flex-col justify-center">
            <h1 className="text-5xl md:text-7xl font-black text-cta mb-16 uppercase font-display tracking-tight">
              Kontakt
            </h1>

            <div className="space-y-4 mb-12">
              <h2 className="text-3xl md:text-4xl font-heading text-white leading-tight">
                Powiedz nam,{" "}
                <strong className="text-white font-normal">czego potrzebujesz</strong>, a znajdziemy
                sposób, by razem się{" "}
                <strong className="text-white font-normal">ruszać</strong>,{" "}
                <strong className="text-white font-normal">oddychać</strong> i{" "}
                <strong className="text-white font-normal">tworzyć</strong>.
              </h2>
            </div>

            <div className="space-y-8">
              <div>
                <strong className="text-cta uppercase tracking-widest text-xs mb-1 block font-heading">
                  Email
                </strong>
                <a
                  href="mailto:business@ori-craftlabs.com"
                  className="text-2xl font-bold text-white hover:text-cta transition-colors font-heading"
                >
                  business@ori-craftlabs.com
                </a>
              </div>

              <div>
                <strong className="text-cta uppercase tracking-widest text-xs mb-1 block font-heading">
                  Lokalizacja
                </strong>
                <p className="text-2xl font-bold text-white font-heading">Poznań, Poland</p>
              </div>
              <div>
                <strong className="text-cta uppercase tracking-widest text-xs mb-1 block font-heading">
                  Telefon
                </strong>
                <p className="text-xl text-white font-heading">+48 669 314 384</p>
                <p className="text-xl text-white font-heading">+48 791 198 825</p>
              </div>
            </div>
          </div>

          {/* RIGHT: Form */}
          <div className="bg-black/40 border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl shadow-black/60">
            <h3 className="text-2xl font-bold text-white mb-6 font-heading">Napisz do nas</h3>

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-white mb-2 uppercase tracking-wide font-heading"
                >
                  Imię
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta transition-colors font-body"
                  placeholder="Twoje imię"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-white mb-2 uppercase tracking-wide font-heading"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta transition-colors font-body"
                  placeholder="Twój email"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-white mb-2 uppercase tracking-wide font-heading"
                >
                  Temat
                </label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta transition-colors font-body appearance-none"
                  defaultValue="Pytanie ogólne"
                >
                  <option className="bg-brand">Pytanie ogólne</option>
                  <option className="bg-brand">Sesje indywidualne</option>
                  <option className="bg-brand">Sesje Duo / dla par</option>
                  <option className="bg-brand">Firma / zespół</option>
                  <option className="bg-brand">Inne</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-white mb-2 uppercase tracking-wide font-heading"
                >
                  Wiadomość
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta transition-colors font-body"
                  placeholder="Twoja wiadomość..."
                  required
                ></textarea>
              </div>

              <div className="absolute -left-[9999px]" aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>

              <label className="flex items-start gap-3 text-sm text-white/75 font-body">
                <input type="checkbox" name="consent" required className="mt-1 accent-cta" />
                <span>
                  Wyrażam zgodę na przetwarzanie danych w celu odpowiedzi na wiadomość. Szczegóły opisuje {" "}
                  <Link href="/privacy" className="underline hover:text-cta">Polityka prywatności</Link>.
                </span>
              </label>

              {/* Status message – only ONE at a time */}
              {status === "success" && (
                <p className="text-sm text-green-400 font-body">{messageText}</p>
              )}
              {status === "error" && (
                <p className="text-sm text-red-400 font-body">{messageText}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-cta text-black rounded-full font-bold uppercase tracking-widest text-lg font-heading shadow-lg shadow-cta/20 hover:bg-cta/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Wysyłanie..." : "Wyślij wiadomość"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
