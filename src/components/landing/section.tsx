"use client";

import React, { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

interface SectionProps {
    id: string;
    title: string;
    children: React.ReactNode;
    className?: string;
}

export function Section({ id, title, children, className }: SectionProps) {
    const container = useRef(null);
    const titleRef = useRef(null);
    const contentRef = useRef(null);

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: container.current,
                start: "top 75%",
                end: "bottom 25%",
                toggleActions: "play reverse play reverse",
            },
        });

        tl.from(titleRef.current, {
            y: 100,
            opacity: 0,
            duration: 1,
            ease: "power4.out",
        })
            .from(contentRef.current, {
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out",
            }, "-=0.8");

    }, { scope: container });

    return (
        <section
            ref={container}
            id={id}
            className={cn("min-h-screen py-32 px-4 md:px-12 flex flex-col items-center justify-center relative z-10", className)}
        >
            <h2 ref={titleRef} className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-linear-to-b from-white to-white/50 mb-16 text-center uppercase tracking-tighter font-heading">
                {title}
            </h2>
            <div ref={contentRef} className="w-full max-w-7xl mx-auto font-body">
                {children}
            </div>
        </section>
    );
}
