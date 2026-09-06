import React from "react";

export default function HistoryPage() {
    return (
        <main className="min-h-screen bg-brand pt-24 pb-16">
            <div className="container mx-auto px-8 max-w-4xl">
                <h1 className="text-5xl md:text-7xl font-black text-white mb-8 uppercase font-display">
                    Nasza historia
                </h1>
                <p className="text-2xl text-white font-bold mb-12 font-heading">
                    Taniec był drzwiami.
                </p>
                <p className="text-white/80 text-lg leading-relaxed mb-16 font-body">
                    Poznaliśmy się na parkiecie. Najpierw jako nauczyciel i uczeń, potem jako dwoje ludzi, którzy wybierali, by razem się ruszać, rozmawiać i tworzyć.
                </p>

                <div className="relative border-l border-white/20 pl-8 ml-4 space-y-16">

                    <div className="relative">
                        <span className="absolute -left-[41px] top-0 w-5 h-5 bg-black border-4 border-cta rounded-full"></span>
                        <span className="text-cta text-sm font-bold uppercase tracking-widest mb-2 block font-heading">Krok 1</span>
                        <h3 className="text-2xl font-bold text-white mb-4 font-heading">Wspólne zajęcia taneczne</h3>
                        <p className="text-white/70 font-body">
                            Zaczęliśmy od zajęć tańca latynoskiego – ustrukturyzowanych, zabawnych i skupionych na prowadzeniu i podążaniu.
                        </p>
                    </div>

                    <div className="relative">
                        <span className="absolute -left-[41px] top-0 w-5 h-5 bg-black border-4 border-accent1 rounded-full"></span>
                        <span className="text-accent1 text-sm font-bold uppercase tracking-widest mb-2 block font-heading">Krok 2</span>
                        <h3 className="text-2xl font-bold text-white mb-4 font-heading">Warsztaty i małe wydarzenia</h3>
                        <p className="text-white/70 font-body">
                            Zauważyliśmy, że ludzie zostają po zajęciach, by rozmawiać, dzielić się historiami i pić kawę. Zajęcia zmieniły się w małe wieczory społecznościowe.
                        </p>
                    </div>

                    <div className="relative">
                        <span className="absolute -left-[41px] top-0 w-5 h-5 bg-black border-4 border-accent2 rounded-full"></span>
                        <span className="text-accent2 text-sm font-bold uppercase tracking-widest mb-2 block font-heading">Krok 3</span>
                        <h3 className="text-2xl font-bold text-white mb-4 font-heading">Ruch, kultura i smaki</h3>
                        <p className="text-white/70 font-body">
                            Powoli dodawaliśmy więcej: oddech, świadomość ciała, kubańsko-polskie smaki i małe rytuały wokół kawy i jedzenia.
                        </p>
                    </div>

                    <div className="relative">
                        <span className="absolute -left-[41px] top-0 w-5 h-5 bg-white rounded-full"></span>
                        <span className="text-white text-sm font-bold uppercase tracking-widest mb-2 block font-heading">Dzisiaj</span>
                        <h3 className="text-3xl font-black text-white mb-4 font-display">Ori Craft Labs</h3>
                        <p className="text-white/70 font-body">
                            Żywe laboratorium, gdzie ruch, wellness, kultura i smaki pomagają ludziom odzyskać kontakt ze sobą i ze sobą nawzajem.
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}
