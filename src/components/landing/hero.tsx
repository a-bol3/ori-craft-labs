"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { GlowingButton } from "@/components/ui/glowing-button";
import Link from "next/link";


export function Hero() {
    const container = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Basic intro animation
        gsap.from(textRef.current?.children || [], {
            y: 100,
            opacity: 0,
            duration: 1.5,
            stagger: 0.2,
            ease: "power4.out",
        });
    }, { scope: container });

    return (
        <section ref={container} className="relative flex flex-col items-center justify-center min-h-screen px-4 text-center pt-20 overflow-hidden">
            <div className="absolute inset-0 z-0">
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover opacity-60" // Reduced opacity slightly via class or use overlay. Let's use overlay div instead for better control.
                    src="https://cdn.pixabay.com/video/2024/03/18/204565-924698132_tiny.mp4"
                />
                <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay for text contrast */}
            </div>
            <div ref={textRef} className="flex flex-col items-center relative z-10">
                <h1 className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tighter text-white mb-6 uppercase flex flex-col gap-2 font-display leading-[1.1] py-2">
                    <span className="leading-none">Poczuj rytm.</span>
                    <span className="leading-none text-transparent bg-clip-text bg-linear-to-r from-accent1 via-cta to-accent2 pb-2">
                        Żyj kulturą.
                    </span>
                </h1>

                <p className="max-w-2xl text-lg md:text-xl text-white/80 mb-10 leading-relaxed font-light font-body">
                    Ori Craft Labs to ciepła przestrzeń, gdzie latynoski ruch, świadomość ciała, kubańsko-polskie smaki i wspólne rytuały łączą się w jedno doświadczenie.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <GlowingButton href="/services" innerClassName="text-lg px-8 py-4">
                        Rozpocznij podróż
                    </GlowingButton>
                    <Link href="/offers" className="px-8 py-4 border border-white/30 text-white font-bold rounded-full hover:bg-white/10 transition-colors text-lg backdrop-blur-sm font-heading">
                        Zobacz ofertę
                    </Link>
                </div>
            </div>
        </section>
    );
}
