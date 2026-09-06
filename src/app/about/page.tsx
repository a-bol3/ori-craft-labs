import React from "react";
import Image from "next/image";
import CommonVideoHeader from "@/components/ui/common-video-header";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-brand pt-32 pb-24 relative overflow-hidden">
            <CommonVideoHeader />
            <div className="container mx-auto px-8 max-w-6xl relative z-10">
                <h1 className="text-5xl md:text-7xl font-black text-cta mb-16 uppercase font-display tracking-tight text-center">
                    O nas
                </h1>

                <div className="mb-24">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white/40 mb-12 leading-tight font-display tracking-tight max-w-5xl mx-auto text-center">
                        <strong className="text-white font-normal">Kubańsko-polski duet</strong> z rytmem i korzeniami. Ori Craft Labs wyrosło z <strong className="text-white font-normal">zajęć tanecznych</strong>, długich rozmów i wspólnych <strong className="text-white font-normal">rytuałów kawowych</strong>.
                    </h2>
                    <div className="text-xl md:text-2xl text-white/70 max-w-4xl leading-relaxed font-body font-light mx-auto text-center">
                        Jedno z nas jest Kubańczykiem z wieloletnim doświadczeniem w architekturze. Drugie wnosi polską wrażliwość i perspektywę terapeutyczną. Razem tworzymy przestrzeń, gdzie <span className="text-white font-bold">ciało, kultura i smaki</span> się spotykają.
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-12 mb-24 max-w-4xl mx-auto text-center">
                    <div>
                        <div className="text-4xl md:text-6xl font-light text-white mb-2 font-display">12+</div>
                        <div className="text-white/40 text-sm uppercase tracking-wide">Lat doświadczenia</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-6xl font-light text-white mb-2 font-display">5000+</div>
                        <div className="text-white/40 text-sm uppercase tracking-wide">Uczestników</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-6xl font-light text-white mb-2 font-display">100+</div>
                        <div className="text-white/40 text-sm uppercase tracking-wide">Wydarzeń</div>
                    </div>
                    <div>
                        <div className="text-4xl md:text-6xl font-light text-white mb-2 font-display">4.9</div>
                        <div className="text-white/40 text-sm uppercase tracking-wide">Średnia ocena</div>
                    </div>
                </div>

                {/* Quote */}
                <div className="mb-24 bg-white/5 border-l-4 border-cta p-8 md:p-12 rounded-r-2xl">
                    <p className="text-2xl md:text-3xl text-white italic font-serif leading-relaxed opacity-90">
                        "Chcemy, by ludzie czuli się w swoim ciele jak w domu, połączeni z innymi i zakorzenieni w codziennych rytuałach. Nie przez presję czy perfekcję, ale przez małe, powtarzalne doświadczenia, które są prawdziwe."
                    </p>
                </div>

                {/* Values Grid */}
                <div>
                    <h2 className="text-sm font-bold text-white/50 mb-12 uppercase tracking-widest font-heading border-b border-white/10 pb-4 inline-block">
                        Na czym nam zależy
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        <div className="group">
                            <h3 className="text-2xl text-accent1 font-bold mb-4 font-display group-hover:translate-x-2 transition-transform">Świadomość ciała</h3>
                            <p className="text-white/60 leading-relaxed">
                                Nie gonimy za idealnymi krokami. Zależy nam na tym, jak czujesz się przed, w trakcie i po sesji.
                            </p>
                        </div>
                        <div className="group">
                            <h3 className="text-2xl text-accent2 font-bold mb-4 font-display group-hover:translate-x-2 transition-transform">Kultura jako most</h3>
                            <p className="text-white/60 leading-relaxed">
                                Wnosimy historie, muzykę i smaki z Kuby i Polski, by uczynić kontakt łatwiejszym i bardziej radosnym.
                            </p>
                        </div>
                        <div className="group">
                            <h3 className="text-2xl text-secondary font-bold mb-4 font-display group-hover:translate-x-2 transition-transform">Włączająca przestrzeń</h3>
                            <p className="text-white/60 leading-relaxed">
                                Jesteś mile widziany taki, jaki jesteś – ze swoją energią, ograniczeniami i historią. Bezpieczna przystań.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Founders Image */}
                <div className="mt-24 relative aspect-video w-full bg-white/5 rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center">
                    <p className="text-white/20 font-bold uppercase tracking-widest">[Image: Founders]</p>
                </div>
            </div>
        </main>
    );
}
