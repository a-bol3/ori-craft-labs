// src/components/ui/footer.tsx
"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Logo } from "@/components/ui/logo";

export function Footer() {
    const [newsletterEmail, setNewsletterEmail] = useState("");
    const [newsletterConsent, setNewsletterConsent] = useState(false);
    const [newsletterStatus, setNewsletterStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

    async function handleNewsletterSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!newsletterEmail || !newsletterConsent) return;

        setNewsletterStatus("loading");

        try {
            const res = await fetch("/api/newsletter", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: newsletterEmail, consent: newsletterConsent }),
            });

            if (!res.ok) {
                const data = await res.json().catch(() => ({}));
                throw new Error(data.error || "Newsletter subscription failed");
            }

            setNewsletterStatus("success");
            setNewsletterEmail("");
        } catch (error) {
            console.error(error);
            setNewsletterStatus("error");
        }
    }

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // If we are on the home page, just scroll smoothly to top
        if (window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <footer className="w-full bg-black/40 backdrop-blur-md border-t border-white/10 pt-16 pb-8 text-white relative z-50">
            <div className="container mx-auto px-8 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
                <div className="col-span-1 md:col-span-1 flex flex-col items-start gap-6">
                    <Link href="/" onClick={handleLogoClick} className="w-48 hover:opacity-80 transition-opacity">
                        <Logo className="w-full h-auto text-white" />
                    </Link>
                    <p className="text-cta mb-2 leading-relaxed font-body text-center uppercase">
                        Poczuj rytm. Żyj kulturą.
                    </p>
                    <div className="flex gap-4">
                        {["IG", "TT", "FB", "LI", "YT"].map((social) => (
                            <div
                                key={social}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-xs font-bold uppercase tracking-widest hover:text-brand hover:border-cta transition-colors cursor-pointer"
                            >
                                {social}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="col-span-1 md:col-span-1">
                    <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-secondary font-heading">
                        Nawigacja
                    </h4>
                    <ul className="space-y-2 text-sm text-white/80 font-body">
                        <li>
                            <Link href="/" className="hover:text-cta transition-colors">
                                Strona główna
                            </Link>
                        </li>
                        <li>
                            <Link href="/services" className="hover:text-cta transition-colors">
                                Usługi
                            </Link>
                        </li>
                        <li>
                            <Link href="/offers" className="hover:text-cta transition-colors">
                                Oferta
                            </Link>
                        </li>
                        <li>
                            <Link href="/insights" className="hover:text-cta transition-colors">
                                Inspiracje
                            </Link>
                        </li>
                        <li>
                            <Link href="/about" className="hover:text-cta transition-colors">
                                O nas
                            </Link>
                        </li>
                        <li>
                            <Link href="/history" className="hover:text-cta transition-colors">
                                Nasza historia
                            </Link>
                        </li>
                        <li>
                            <Link href="/faq" className="hover:text-cta transition-colors">
                                FAQ
                            </Link>
                        </li>
                        <li>
                            <Link href="/partners" className="hover:text-cta transition-colors">
                                Partnerzy
                            </Link>
                        </li>
                        <li>
                            <Link href="/contact" className="hover:text-cta transition-colors">
                                Kontakt
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-1">
                    <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-secondary font-heading">
                        Prawne
                    </h4>
                    <ul className="space-y-2 text-sm text-white/80 font-body">
                        <li>
                            <Link href="/terms" className="hover:text-cta transition-colors">
                                Regulamin Świadczenia Usług
                            </Link>
                        </li>
                        <li>
                            <Link href="/privacy" className="hover:text-cta transition-colors">
                                Polityka Prywatności
                            </Link>
                        </li>
                        <li>
                            <Link href="/cookies" className="hover:text-cta transition-colors">
                                Polityka Plików Cookie
                            </Link>
                        </li>
                        <li>
                            <Link href="/cookie-preferences" className="hover:text-cta transition-colors">
                                Preferencje Plików Cookie
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="col-span-1 md:col-span-1">
                    <h4 className="font-bold mb-4 uppercase tracking-widest text-xs text-secondary font-heading">
                        Społeczność i newsletter
                    </h4>
                    <p className="text-white/70 text-sm mb-4 font-body">
                        Nowości, warsztaty i słodkie niespodzianki - bez spamu.
                    </p>
                    <form className="flex flex-col gap-4" onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            name="email"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                            placeholder="Twój adres email"
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta transition-colors text-sm text-white placeholder:text-white/30 font-body"
                        />
                        <label className="flex items-start gap-2 text-xs text-white/65 font-body">
                            <input
                                type="checkbox"
                                checked={newsletterConsent}
                                onChange={(e) => setNewsletterConsent(e.target.checked)}
                                className="mt-0.5 accent-cta"
                                required
                            />
                            <span>
                                Zgadzam się na newsletter i przetwarzanie danych zgodnie z <Link href="/privacy" className="underline hover:text-cta">polityką prywatności</Link>.
                            </span>
                        </label>
                        <button
                            type="submit"
                            className="w-full py-3 bg-cta text-black rounded-full font-bold hover:bg-cta/90 transition-colors uppercase tracking-widest text-xs font-heading"
                        >
                            {newsletterStatus === "loading" ? "Wysyłanie..." : "Połącz się z nami"}
                        </button>
                        {newsletterStatus === "success" && (
                            <p className="text-xs text-green-400 font-body">
                                Dziękujemy! Zapisaliśmy Twój adres.
                            </p>
                        )}
                        {newsletterStatus === "error" && (
                            <p className="text-xs text-red-400 font-body">
                                Coś poszło nie tak. Spróbuj ponownie.
                            </p>
                        )}
                    </form>
                </div>
            </div>

            <div className="border-t border-white/10 pt-6 mt-4">
                <div className="container mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-white/60 font-body">
                    <p>© 2025 Ori Craft Labs. Wszelkie prawa zastrzeżone.</p>
                    <p className="uppercase tracking-[0.2em] text-[10px] text-white/40">
                        System Operational
                    </p>
                </div>
            </div>
        </footer>
    );
}
