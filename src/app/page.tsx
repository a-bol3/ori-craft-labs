"use client";

import React from "react";
import { Hero } from "@/components/landing/hero";
import { Marquee } from "@/components/ui/marquee";
import { InfoCard } from "@/components/ui/info-card";
import Link from "next/link";
import { GlowingButton } from "@/components/ui/glowing-button";

export default function Home() {
  const services = [
    { title: "Movement & Flow", description: "Taniec, oddech i świadomość ciała", category: "Wellbeing" },
    { title: "Stretch & Relax", description: "Łagodne rozciąganie przy muzyce latino", category: "Relaksacja" },
    { title: "Children Rhythm Lab", description: "Rytm i ruch dla dzieci", category: "Dzieci" },
    { title: "Wieczory kultury", description: "Muzyka, opowieści i wspólne tańce", category: "Kultura" },
    { title: "Corporate Wellness", description: "Dni zdrowia dla zespołów", category: "Firmy" },
    { title: "Warsztaty kulinarne", description: "Kubańskie i latynoskie smaki", category: "Smaki" },
  ];

  const offers = [
    { title: "Adults Move & Relax", description: "Regularne sesje ruchowe. od 1000 zł", category: "Dorośli", backgroundImage: "/assets/landing/adults-move.jpg" },
    { title: "Children Rhythm Lab", description: "Program regularny dla dzieci. od 3000 zł/mies", category: "Dzieci", backgroundImage: "/assets/landing/children-rhythm.jpg" },
    { title: "Corporate Wellness Day", description: "Pół lub cały dzień dla zespołów. od 2400 zł", category: "Firmy", backgroundImage: "/assets/landing/corporate-wellness.png" },
    { title: "Cooking & Tasting", description: "Kubańsko-polskie doświadczenie smaków. od 390 zł/os", category: "Smaki", backgroundImage: "/assets/landing/cooking-tasting.jpg" },
    { title: "Weekend Retreat", description: "Ruch, kultura i smaki. od 13000 zł", category: "Wyjazdy", backgroundImage: "/assets/landing/weekend-retreat.jpg" },
  ];

  const insights = [
    { title: "Dlaczego powolny ruch...", description: "Odkryj siłę slow movement", category: "Ruch" },
    { title: "Kawa, muzyka i rytuały", description: "Reset układu nerwowego w 10 minut", category: "Rytuały" },
    { title: "Od kroków do świadomości", description: "Podróż od techniki do intuicji", category: "Świadomość ciała" },
    { title: "Zanurzenie w kulturze", description: "Jak rytm łączy nas z kulturą", category: "Kultura" },
  ];

  return (
    <main className="min-h-screen bg-brand selection:bg-cta selection:text-brand overflow-x-hidden">
      <Hero />

      {/* Gradient Separator */}
      <div className="w-full h-32 bg-linear-to-b from-transparent to-black/20 relative z-10 pointer-events-none" />

      {/* Services Section - Infinite Scroll Left */}
      <section className="py-24 relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/5 -mt-32">
        <div className="container mx-auto px-4 mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/50 mb-6 uppercase tracking-tighter font-heading">
            Co oferujemy
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto font-body">
            Ruch, wellness, kultura i smaki - zaprojektowane, by pomóc Ci odzyskać kontakt z ciałem i społecznością.
          </p>
        </div>
        <Marquee direction="left" speed={50}>
          {services.map((item, i) => (
            <InfoCard key={i} title={item.title} description={item.description} category={item.category} link="/services" />
          ))}
        </Marquee>
        <div className="flex justify-center mt-12">
          <GlowingButton href="/services" variant="gold">
            Pełna oferta
          </GlowingButton>
        </div>
      </section>

      {/* Offers Section - Infinite Scroll Right */}
      <section className="py-24 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-4 mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/50 mb-6 uppercase tracking-tighter font-heading">
            Pakiety i oferty
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto font-body">
            Wybierz karnet lub pakiet pasujący do Twojego rytmu - dla Ciebie, z partnerem lub dla Twojego zespołu.
          </p>
        </div>
        <Marquee direction="right" speed={50}>
          {offers.map((item, i) => (
            <InfoCard key={i} title={item.title} description={item.description} category={item.category} link="/offers" backgroundImage={item.backgroundImage} />
          ))}
        </Marquee>
        <div className="flex justify-center mt-12">
          <GlowingButton href="/offers" variant="gold">
            Zobacz pakiety
          </GlowingButton>
        </div>
      </section>

      {/* Insights Section - Infinite Scroll Left */}
      <section className="py-24 relative z-10 bg-black/20 backdrop-blur-sm border-t border-white/5">
        <div className="container mx-auto px-4 mb-16 text-center">
          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/50 mb-6 uppercase tracking-tighter font-heading">
            Inspiracje i historie
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto font-body">
            Krótkie teksty o ruchu, świadomości ciała, rytuałach kulturowych i życiu w stylu slow.
          </p>
        </div>
        <Marquee direction="left" speed={60}>
          {insights.map((item, i) => (
            <InfoCard key={i} title={item.title} description={item.description} category={item.category} link="/insights" />
          ))}
        </Marquee>
        <div className="flex justify-center mt-12">
          <GlowingButton href="/insights" variant="gold">
            Czytaj bloga
          </GlowingButton>
        </div>
      </section>

      {/* Who We Are - Redesigned to match other sections */}
      <section className="py-32 relative z-10 border-t border-white/5">
        <div className="container mx-auto px-8 max-w-6xl text-center">

          <h2 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/50 mb-6 uppercase tracking-tighter font-heading">
            O nas
          </h2>

          <p className="text-2xl md:text-4xl lg:text-5xl font-medium text-white/60 mb-16 leading-tight max-w-5xl mx-auto font-display tracking-tight">
            Jesteśmy <strong className="text-white font-normal">kubańsko-polskim duetem</strong> łączącym <strong className="text-white font-normal">rytmy</strong>, <strong className="text-white font-normal">emocje</strong> i <strong className="text-white font-normal">codzienne rytuały</strong>. Taniec otworzył drzwi. Od wspólnych zajęć i warsztatów powoli stworzyliśmy przestrzeń, gdzie <strong className="text-white font-normal">ruch</strong>, <strong className="text-white font-normal">kultura</strong> i <strong className="text-white font-normal">jedzenie</strong> stały się jednym <strong className="text-white font-normal">językiem życia</strong>.
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 border-t border-white/10 pt-12 mb-16">
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-light text-white mb-2 font-display">12+</div>
              <div className="text-white/40 text-sm uppercase tracking-wide">Lat doświadczenia</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-light text-white mb-2 font-display">5000+</div>
              <div className="text-white/40 text-sm uppercase tracking-wide">Uczestników</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-light text-white mb-2 font-display">100+</div>
              <div className="text-white/40 text-sm uppercase tracking-wide">Wydarzeń</div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-4xl md:text-5xl font-light text-white mb-2 font-display">4.9</div>
              <div className="text-white/40 text-sm uppercase tracking-wide">Średnia ocena</div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-12">
            <div className="text-white/30 text-xs font-bold tracking-widest uppercase mb-12">Zaufali nam</div>

            <Marquee direction="left" speed={40} className="py-4">
              {/* Expanded Partner List */}
              {[
                "Google", "Spotify", "Mindvalley", "Samsung",
                "Nike", "Lululemon", "Headspace", "Calm", "Airbnb", "Sonos"
              ].map((partner, i) => (
                <div key={i} className="mx-8 opacity-50 grayscale hover:grayscale-0 transition-all duration-500 hover:opacity-100">
                  <span className="text-2xl font-bold text-white font-heading">{partner}</span>
                </div>
              ))}
            </Marquee>
          </div>

          <div className="mt-16">
            <Link href="/about" className="inline-block px-10 py-4 border border-white/20 text-white font-bold rounded-full hover:bg-white hover:text-brand transition-colors font-heading text-sm uppercase tracking-widest">
              Czytaj pełną historię &gt;
            </Link>
          </div>
        </div>
      </section>

      {/* Talk To Us */}
      <section className="py-32 relative z-10 bg-linear-to-b from-brand to-black border-t border-white/5">
        <div className="container mx-auto px-8 text-center">
          <h2 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/30 mb-8 uppercase tracking-tighter font-display">
            Porozmawiajmy
          </h2>
          <p className="text-white/70 text-xl max-w-2xl mx-auto mb-12 font-body font-light">
            Powiedz nam, czego potrzebujesz - spokojnych zajęć, wydarzenia dla zespołu czy czegoś pomiędzy.
          </p>
          <Link href="/contact" className="inline-block px-12 py-5 bg-cta text-brand font-black rounded-full hover:bg-white transition-colors uppercase tracking-widest text-lg font-heading shadow-lg shadow-cta/20">
            Skontaktuj się z nami
          </Link>
        </div>
      </section>
    </main>
  );
}
