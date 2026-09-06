import React from "react";

export default function FAQPage() {
    return (
        <main className="min-h-screen bg-brand pt-24 pb-16">
            <div className="container mx-auto px-8 max-w-3xl">
                <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase font-display">
                    FAQ
                </h1>
                <p className="text-xl text-white/70 mb-16 font-body">
                    Często zadawane pytania. Jeśli nie znajdziesz tu odpowiedzi, napisz do nas.
                </p>

                <div className="space-y-12">

                    <section>
                        <h2 className="text-cta text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2 font-heading">Ogólne</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 font-heading">Czy potrzebuję doświadczenia tanecznego?</h3>
                                <p className="text-white/70 font-body">Nie. Nasze sesje Movement & Flow są zaprojektowane dla osób na każdym poziomie, w tym dla zupełnie początkujących.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 font-heading">W co się ubrać?</h3>
                                <p className="text-white/70 font-body">Wygodne ubrania, w których możesz się ruszać, oraz buty lub skarpetki, które się nie ślizgają. Na wiele sesji boso też jest w porządku.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-accent1 text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2 font-heading">Usługi i oferta</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 font-heading">Czy mogę przyjść sam?</h3>
                                <p className="text-white/70 font-body">Tak. Wiele osób przychodzi w pojedynkę i nawiązuje kontakt z innymi podczas sesji. Oferujemy też formaty Duo i grupowe.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 font-heading">Czy pracujecie z firmami?</h3>
                                <p className="text-white/70 font-body">Tak. Oferujemy Dni Wellness dla Firm i szyte na miarę doświadczenia dla zespołów.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-secondary text-sm font-bold uppercase tracking-widest mb-6 border-b border-white/10 pb-2 font-heading">Rezerwacje i płatności</h2>
                        <div className="space-y-8">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 font-heading">Jak zarezerwować sesję?</h3>
                                <p className="text-white/70 font-body">Możesz skontaktować się przez formularz, media społecznościowe lub – gdy będzie dostępny – zarezerwować bezpośrednio przez nasz system online.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-2 font-heading">Jakie metody płatności akceptujecie?</h3>
                                <p className="text-white/70 font-body">Na razie akceptujemy przelew bankowy i płatności kartą.</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
