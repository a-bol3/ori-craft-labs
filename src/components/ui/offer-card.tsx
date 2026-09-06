"use client";

import React from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Check } from "lucide-react";

interface OfferCardProps {
    title: string;
    price: string;
    priceSuffix?: string;
    features: string[];
    description?: string;
    buttonText?: string;
    href?: string;
    highlight?: boolean;
    gradientColor?: "cta" | "red" | "blue" | "purple" | "default";
    className?: string;
}

export function OfferCard({
    title,
    price,
    priceSuffix,
    features,
    description,
    buttonText = "Kontaktuj się",
    href = "/contact",
    highlight = false,
    gradientColor = "default",
    className,
}: OfferCardProps) {

    // Map for the "Rainbow Rays" background effect - INTENSIFIED
    const raysGradientMap = {
        cta: "linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.45) 25%, rgba(0,0,0,0) 40%, rgba(255, 140, 0, 0.45) 65%, transparent 80%, rgba(255, 255, 255, 0.2) 95%)",
        red: "linear-gradient(90deg, transparent 5%, rgba(220, 38, 38, 0.55) 25%, transparent 45%, rgba(168, 85, 247, 0.45) 65%, transparent 85%, rgba(239, 68, 68, 0.55) 95%)",
        blue: "linear-gradient(90deg, transparent 5%, rgba(6, 182, 212, 0.55) 25%, transparent 45%, rgba(37, 99, 235, 0.55) 65%, transparent 85%, rgba(14, 165, 233, 0.55) 95%)",
        purple: "linear-gradient(90deg, transparent 5%, rgba(168, 85, 247, 0.55) 20%, transparent 40%, rgba(236, 72, 153, 0.55) 70%, transparent 90%, rgba(99, 102, 241, 0.55) 98%)",
        default: "linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.1) 50%, transparent 100%)",
    };

    // Map internal color names to actual Tailwind classes for the gradient streak
    const gradientMap = {
        cta: "from-cta/30 to-transparent",
        red: "from-accent1/30 to-transparent",
        blue: "from-secondary/30 to-transparent",
        purple: "from-accent4/30 to-transparent",
        default: "from-white/20 to-transparent",
    };

    const borderMap = {
        cta: "group-hover:border-cta/80 border-cta/20",
        red: "group-hover:border-accent1/80 border-accent1/20",
        blue: "group-hover:border-secondary/80 border-secondary/20",
        purple: "group-hover:border-accent4/80 border-accent4/20",
        default: "group-hover:border-white/50 border-white/10",
    }

    return (
        <div className={cn(
            "relative group flex flex-col h-full bg-[#0F0F11] border rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
            borderMap[gradientColor],
            className
        )}>

            {/* Background Gradient Streak (Fusion Element 1) - The "Rainbow Rays" */}
            {/* Reduced blur-xl to make lines more distinct as 'rays' */}
            <div
                className="absolute inset-0 opacity-60 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen filter blur-xl"
                style={{ background: raysGradientMap[gradientColor] }}
            />

            {/* Additional vertical glow layer for depth */}
            <div
                className={cn(
                    "absolute inset-0 bg-base-black opacity-40 mix-blend-overlay pointer-events-none"
                )}
            />
            <div
                className={cn(
                    "absolute inset-0 bg-linear-to-b opacity-20 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none",
                    gradientMap[gradientColor]
                )}
            />

            {/* Top Section: Header & Price */}
            <div className="relative p-8 pb-4 z-10">
                <h3 className="text-lg font-medium text-white/90 mb-4 font-heading tracking-wide">
                    {title}
                </h3>
                <div className="flex items-baseline gap-1 mb-2">
                    <span className={cn("text-4xl md:text-5xl font-black font-display tracking-tight text-white")}>
                        {price}
                    </span>
                    {priceSuffix && (
                        <span className="text-sm text-white/50 font-body uppercase tracking-wider font-semibold">
                            {priceSuffix}
                        </span>
                    )}
                </div>
            </div>

            {/* Features List */}
            <div className="relative px-8 py-6 flex-1 bg-white/5 border-t border-white/5 z-10 backdrop-blur-sm">
                <ul className="space-y-4">
                    {features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-white/70 font-body">
                            <Check className={cn("w-5 h-5 shrink-0",
                                gradientColor === 'cta' ? "text-cta" :
                                    gradientColor === 'red' ? "text-accent1" :
                                        gradientColor === 'blue' ? "text-secondary" : "text-white"
                            )} />
                            <span className="leading-snug">{feat}</span>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Footer Section: Description (Value) & Button */}
            <div className="relative p-6 pt-0 bg-white/5 border-t-0 flex flex-col gap-6 z-10 backdrop-blur-sm">
                {description && (
                    <div className="pt-6 border-t border-white/5">
                        <p className="text-xs text-white/50 font-heading uppercase tracking-widest mb-2 font-bold">Wartość</p>
                        <p className="text-sm text-white/70 italic font-body">
                            "{description}"
                        </p>
                    </div>
                )}

                <Link href={href} className={cn(
                    "w-full py-4 rounded-xl font-bold font-heading text-center uppercase tracking-widest text-xs transition-all duration-300 shadow-lg",
                    gradientColor === 'cta' ? "bg-cta text-brand hover:bg-white" :
                        gradientColor === 'red' ? "bg-accent1 text-white hover:bg-white hover:text-brand" :
                            gradientColor === 'blue' ? "bg-secondary text-brand hover:bg-white" :
                                gradientColor === 'purple' ? "bg-accent4 text-white hover:bg-white hover:text-brand" :
                                    "bg-white/10 text-white hover:bg-white hover:text-brand"
                )}>
                    {buttonText}
                </Link>
            </div>

        </div>
    );
}
