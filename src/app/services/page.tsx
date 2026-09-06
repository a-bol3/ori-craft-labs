"use client";

import React from "react";
import { ServiceCard } from "@/components/ui/service-card";
import CommonVideoHeader from "@/components/ui/common-video-header";

export default function ServicesPage() {
    return (
        <main className="min-h-screen bg-brand pt-24 pb-16 relative overflow-hidden">
            <CommonVideoHeader />
            <div className="container mx-auto px-6 md:px-8 relative z-10">
                <h1 className="text-5xl md:text-7xl font-black text-cta mb-16 uppercase font-display tracking-tight text-center">
                    Usługi
                </h1>

                <div className="mb-24">
                    <h2 className="text-4xl md:text-6xl lg:text-7xl font-medium text-white/40 mb-12 leading-tight font-display tracking-tight max-w-4xl mx-auto text-center">
                        Od <strong className="text-white font-normal">ruchu</strong> i <strong className="text-white font-normal">oddechu</strong> po <strong className="text-white font-normal">smaki</strong> i <strong className="text-white font-normal">kulturę</strong> - wybierz, jak chcesz <strong className="text-white font-normal">odzyskać równowagę</strong>.
                    </h2>
                </div>

                <div className="space-y-24">

                    {/* Wellbeing i ruch */}
                    <section>
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-2 uppercase font-heading text-center">
                                Wellbeing i ruch
                            </h2>
                            <p className="text-white/50 text-sm uppercase tracking-wider font-body text-center">Sesje ruchowe i wellness dla ciała i umysłu</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ServiceCard
                                title="Zajęcia Movement & Flow"
                                subtitle="Dance · Breath · Body awareness"
                                description="Dynamiczne sesje ruchowe łączące taniec latino/karaibski, oddech i świadomość ciała. Uczestnicy nie muszą 'umieć tańczyć' - skupiamy się na ekspresji, rytmie i kontakcie z ciałem."
                                values={
                                    <ul className="space-y-3">
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Po 1 sesji:</strong>
                                            Uwolnienie napięć, lepsza energia, lepszy nastrój, poczucie bycia 'w ciele' a nie tylko 'w głowie'.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Po 4 sesjach:</strong>
                                            Lepsza koordynacja, większa pewność w ruchu, lepsza postura, mniej stresu, większa radość z bycia w ciele.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Długoterminowo:</strong>
                                            Widoczna zmiana świadomości ciała, lepsza sprawność i płynność, odporność emocjonalna, silniejsze poczucie tożsamości i obecności.
                                        </li>
                                    </ul>
                                }
                                variant="teal"
                            />
                            <ServiceCard
                                title="Stretch & Relax (przy muzyce latino)"
                                subtitle="Stretching · Relaksacja · Slow Flow"
                                description="Łagodne rozciąganie połączone z powolnym ruchem i relaksacją przy muzyce latynoskiej. Skupienie: mobilność, uspokojenie układu nerwowego, uwolnienie po pracy."
                                values={
                                    <ul className="space-y-3">
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Po 1 sesji:</strong>
                                            Lżejsze ciało, mniej sztywności (zwłaszcza kark/barki/plecy), spokój umysłu.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Po kilku sesjach:</strong>
                                            Lepsza elastyczność, łatwiejszy ruch w codzienności, lepszy sen, mniej napiętych mięśni.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Regularnie:</strong>
                                            Zdrowsza postura, mniej bólów od siedzenia, naturalny nawyk relaksu i oddychania, długotrwały komfort ciała.
                                        </li>
                                    </ul>
                                }
                                variant="teal"
                            />
                            <ServiceCard
                                title="Firmowe dni zdrowia i cykle wellbeingowe"
                                subtitle="Szyte na miarę programy ruch + relaks + rytm dla zespołów"
                                description="Może być pół dnia, cały dzień lub regularny cykl dla HR / L&D."
                                values={
                                    <ul className="space-y-3">
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Po 1 sesji:</strong>
                                            Ulga od stresu, reset od rutyny, lepsza energia w zespołach, poczucie dbałości pracodawcy.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Po cyklu:</strong>
                                            Widoczna redukcja napięć, lepsze skupienie, więcej otwartości i zaufania w zespole, lepsza atmosfera.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Długoterminowo:</strong>
                                            Zdrowsi, szczęśliwsi pracownicy, niższe ryzyko wypalenia, silniejsza kultura firmy.
                                        </li>
                                    </ul>
                                }
                                variant="teal"
                            />
                        </div>
                    </section>

                    {/* Kultura w ruchu */}
                    <section>
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-accent1 mb-2 uppercase font-heading text-center">
                                Kultura w ruchu
                            </h2>
                            <p className="text-white/50 text-sm uppercase tracking-wider font-body text-center">Taniec, rytm i kulturowe doświadczenia</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ServiceCard
                                title="Interaktywne warsztaty tańca i rytmu"
                                description="Interaktywne warsztaty w kubańskich/latynoskich rytmach, muzykalności, perkusji ciała i prostych krokach tańca towarzyskiego. Zawsze dostosowane do poziomu grupy."
                                values={
                                    <ul className="space-y-3">
                                        <li>
                                            <strong className="block text-white text-xs mb-1">1 warsztat:</strong>
                                            Zabawa, przełamanie lodów, śmiech, poczucie grupowej energii.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Seria warsztatów:</strong>
                                            Lepszy rytm, większa pewność w tańcu, uwolnienie emocjonalne, lepsza więź grupowa.
                                        </li>
                                    </ul>
                                }
                                variant="red"
                            />
                            <ServiceCard
                                title="Wieczory kultury (muzyka, opowieści, wspólne tańce)"
                                description="Wieczory z muzyką, historiami z Kuby i Ameryki Łacińskiej, prostymi wspólnymi tańcami i vibe społeczności."
                                values={
                                    <ul className="space-y-3">
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Jedno wydarzenie:</strong>
                                            Zanurzenie w kulturze, emocjonalny lifting, połączenie z innymi, doświadczenie 'mini podróży' bez opuszczania miasta.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Seria warsztatów:</strong>
                                            Głębsze zrozumienie kultury, silniejsza społeczność, miejsce do którego ludzie wracają by czuć się widzianymi i połączonymi.
                                        </li>
                                    </ul>
                                }
                                variant="red"
                            />
                            <ServiceCard
                                title="Prelekcje i współprace z domami kultury"
                                description="Prelekcje, interaktywne wykłady i wydarzenia o kubańskiej/latynoskiej kulturze, historii, muzyce, rytmie, tożsamości — często z elementem ruchu lub muzyki."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Edukacja kulturowa, inspiracja, szerszy światopogląd, atrakcyjny program dla domów kultury, który przyciąga i angażuje ludzi.
                                    </div>
                                }
                                variant="red"
                            />
                        </div>
                    </section>

                    {/* Smaki i kuchnia */}
                    <section>
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-cta mb-2 uppercase font-heading text-center">
                                Smaki i kuchnia
                            </h2>
                            <p className="text-white/50 text-sm uppercase tracking-wider font-body text-center">Kubańskie i latynoskie doświadczenia kulinarne</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ServiceCard
                                title="Warsztaty kulinarne i degustacje (kuchnia kubańska/latynoska)"
                                description="Praktyczne gotowanie kubańskich/latynoskich dań plus opowieści i degustacja."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Nowe smaki, konkretne przepisy, inspiracja do codziennego gotowania, wspólne doświadczenie (zespół, przyjaciele, rodzina) i wzbogacenie kulturowe.
                                    </div>
                                }
                                variant="gold"
                            />
                            <ServiceCard
                                title="Wydarzenia łączące kuchnię i kulturę"
                                description="Wydarzenia gdzie jedzenie, muzyka, historie i czasem taniec łączą się w jedno doświadczenie."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Silna emocjonalna pamięć, poczucie bycia częścią historii, głębsze zrozumienie kultury przez wszystkie zmysły.
                                    </div>
                                }
                                variant="gold"
                            />
                            <ServiceCard
                                title="Integracje zespołów przy gotowaniu"
                                description="Sesje team-buildingowe gdzie ludzie gotują razem, smakują i dzielą się historiami."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Lepsza współpraca, śmiech, przełamanie wzorców "tylko w biurze", budowanie wspólnych wspomnień które wzmacniają zespoły.
                                    </div>
                                }
                                variant="gold"
                            />
                        </div>
                    </section>

                    {/* Edukacja i Szkoły */}
                    <section>
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-accent2 mb-2 uppercase font-heading text-center">
                                Edukacja i szkoły
                            </h2>
                            <p className="text-white/50 text-sm uppercase tracking-wider font-body text-center">Programy dla dzieci, młodzieży i szkół</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            <ServiceCard
                                title="Rytm i taniec (musicality) - Children Rhythm Lab"
                                description="Laboratoria rytmu i ruchu dla dzieci i młodzieży. Muzykalność, koordynacja, zabawa, kreatywność."
                                values={
                                    <ul className="space-y-3">
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Jedna lekcja:</strong>
                                            Dzieci się ruszają, bawią, śmieją, spalają energię w zdrowy sposób.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Regularnie:</strong>
                                            Lepsze umiejętności motoryczne, rytm, pewność siebie, kooperacja, radość z ruchu zamiast czasu przed ekranem.
                                        </li>
                                    </ul>
                                }
                                variant="pink"
                            />
                            <ServiceCard
                                title="Język hiszpański - zajęcia interaktywne"
                                description="Hiszpański przez zabawę, wizualizacje, ruch oraz słuchanie i mówienie."
                                values={
                                    <ul className="space-y-3">
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Jedna lekcja:</strong>
                                            Pierwszy kontakt z językiem w przyjemny, zabawny sposób.
                                        </li>
                                        <li>
                                            <strong className="block text-white text-xs mb-1">Regularnie:</strong>
                                            Słownictwo, umiejętności słuchania, ciekawość innych kultur, lepsza pamięć i zdolności poznawcze.
                                        </li>
                                    </ul>
                                }
                                variant="pink"
                            />
                            <ServiceCard
                                title="Zajęcia artystyczne (plastyka, taniec, śpiew)"
                                description="Dzieci eksplorują sztukę, ruch i głos, często związane z historiami z Kuby/Ameryki Łacińskiej."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Kreatywność, ekspresja, samoocena, radość.
                                    </div>
                                }
                                variant="pink"
                            />
                            <ServiceCard
                                title="Opowieści i bajki kulturowe z Kuby"
                                description="Opowiadanie historii ciałem, głosem, wizualizacjami; często interaktywnie."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Wyobraźnia, empatia, otwarcie na inne kultury.
                                    </div>
                                }
                                variant="pink"
                            />
                            <ServiceCard
                                title="Zajęcia ruchowe (gimnastyka + rytmika)"
                                description="Zabawny, ustrukturyzowany ruch — bezpieczny, dostosowany do wieku, angażujący."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Zdrowie, siła, postura, koordynacja.
                                    </div>
                                }
                                variant="pink"
                            />
                            <ServiceCard
                                title="Zdrowy styl życia poprzez taniec i zabawę"
                                description="Programy uczące dzieci łączenia 'ruch = radość = zdrowie'."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Fundamenty dla zdrowego stylu życia, nie z wykładów ale z doświadczenia.
                                    </div>
                                }
                                variant="pink"
                            />
                            <ServiceCard
                                title="Imprezy szkolne, festyny, zajęcia dodatkowe"
                                description="Wydarzenia, festiwale, animacje pozalekcyjne."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Zaangażowanie, duch szkoły, niezapomniane doświadczenia dla dzieci i rodzin.
                                    </div>
                                }
                                variant="pink"
                            />
                        </div>
                    </section>

                    {/* Firmy i Instytucje */}
                    <section>
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-2 uppercase font-heading text-center">
                                Firmy i instytucje
                            </h2>
                            <p className="text-white/50 text-sm uppercase tracking-wider font-body text-center">Usługi korporacyjne i dla organizacji</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ServiceCard
                                title="Animacje i warsztaty taneczne"
                                description="Interaktywne sesje taneczne dla wydarzeń firmowych."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Energia, integracja, przełamanie barier.
                                    </div>
                                }
                                variant="teal"
                            />
                            <ServiceCard
                                title="Zajęcia taneczno-ruchowe (taniec + gimnastyka + rytmika)"
                                description="Kompleksowe sesje łączące różne formy ruchu."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Wszechstronny rozwój fizyczny i wellbeing.
                                    </div>
                                }
                                variant="teal"
                            />
                            <ServiceCard
                                title="Warsztaty taneczno-kulinarne"
                                description="Unikalne połączenie ruchu i gotowania."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Wyjątkowe doświadczenie integracyjne, multisensoryczne.
                                    </div>
                                }
                                variant="teal"
                            />
                            <ServiceCard
                                title="Zajęcia taneczne z elementami stretchingu i relaksu"
                                description="Taniec połączony z rozciąganiem i relaksem."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Balans energii i regeneracji.
                                    </div>
                                }
                                variant="teal"
                            />
                            <ServiceCard
                                title="Spotkania kulturalne"
                                description="Wydarzenia kulturowe dla firm i instytucji."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Poszerzenie horyzontów, diversity & inclusion.
                                    </div>
                                }
                                variant="teal"
                            />
                            <ServiceCard
                                title="Wystąpienia motywacyjne inspirowane rytmem i kulturą"
                                description="Inspirujące prezentacje z elementami kulturowymi i ruchowymi."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Motywacja, nowa perspektywa, energia.
                                    </div>
                                }
                                variant="teal"
                            />
                            <ServiceCard
                                title="Wyjazdy i podróże integracyjne"
                                description="Wyjazdy integracyjne z elementami ruchu, kultury i smaków."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Głębokie połączenia zespołowe, niezapomniane wspomnienia, reset.
                                    </div>
                                }
                                variant="teal"
                            />
                            <ServiceCard
                                title="Programy szyte na miarę dla HR / L&D"
                                description="Dedykowane programy wellbeingowe i rozwojowe."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Dopasowanie do specyficznych potrzeb organizacji, długoterminowy impact.
                                    </div>
                                }
                                variant="teal"
                            />
                        </div>
                    </section>

                    {/* Prywatnie i Lokalnie */}
                    <section>
                        <div className="mb-12">
                            <h2 className="text-3xl md:text-4xl font-bold text-accent1 mb-2 uppercase font-heading text-center">
                                Prywatnie i lokalnie
                            </h2>
                            <p className="text-white/50 text-sm uppercase tracking-wider font-body text-center">Usługi dla osób prywatnych i społeczności lokalnych</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <ServiceCard
                                title="Rodzinne uroczystości i festyny"
                                description="Animacje i warsztaty dla rodzinnych wydarzeń."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Radość, wspólne wspomnienia, kulturowe wzbogacenie.
                                    </div>
                                }
                                variant="red"
                            />
                            <ServiceCard
                                title="Spotkania międzykulturowe i warsztaty otwarte"
                                description="Otwarte wydarzenia dla społeczności lokalnej."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Budowanie społeczności, wymiana kulturowa, inkluzywność.
                                    </div>
                                }
                                variant="red"
                            />
                            <ServiceCard
                                title="Mentoring i rozwój osobisty poprzez ruch"
                                description="Indywidualne sesje rozwojowe wykorzystujące ciało i ruch."
                                values={
                                    <div>
                                        <strong className="block text-white text-xs mb-1">Wartość:</strong>
                                        Głęboki kontakt z sobą, odkrywanie potencjału, osobista transformacja.
                                    </div>
                                }
                                variant="red"
                            />
                        </div>
                    </section>

                </div>
            </div>
        </main>
    );
}
