"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ServiceCardProps {
    title: string;
    subtitle?: string;
    description: string;
    /** 
     * Array of strings or generic content for the "Value & Effects" section.
     * If it's a list, it will be rendered as bullet points if formatted so, or custom.
     * Based on screenshots, it often looks like keys/values or bullet points.
     * We'll accept a ReactNode or string.
     */
    values?: React.ReactNode;
    variant?: "teal" | "red" | "pink" | "gold";
    className?: string;
}

export function ServiceCard({ title, subtitle, description, values, variant = "teal", className }: ServiceCardProps) {
    const [isOpen, setIsOpen] = useState(false);

    // Intense "Rainbow Rays" gradients adapted from Offers
    const raysGradientMap = {
        teal: "linear-gradient(90deg, transparent 5%, rgba(6, 182, 212, 0.55) 25%, transparent 45%, rgba(32, 163, 158, 0.55) 65%, transparent 85%, rgba(14, 165, 233, 0.55) 95%)",
        red: "linear-gradient(90deg, transparent 5%, rgba(239, 91, 91, 0.55) 25%, transparent 45%, rgba(220, 38, 38, 0.55) 65%, transparent 85%, rgba(239, 68, 68, 0.55) 95%)",
        pink: "linear-gradient(90deg, transparent 5%, rgba(225, 90, 151, 0.55) 25%, transparent 45%, rgba(236, 72, 153, 0.55) 65%, transparent 85%, rgba(219, 39, 119, 0.55) 95%)",
        gold: "linear-gradient(90deg, transparent 0%, rgba(255, 215, 0, 0.45) 25%, rgba(0,0,0,0) 40%, rgba(255, 186, 73, 0.45) 65%, transparent 80%, rgba(255, 255, 255, 0.2) 95%)",
    };

    const borderMap = {
        teal: "group-hover/card:border-secondary/80 border-secondary/20",
        red: "group-hover/card:border-accent1/80 border-accent1/20",
        pink: "group-hover/card:border-accent2/80 border-accent2/20",
        gold: "group-hover/card:border-cta/80 border-cta/20",
    };

    const textHoverMap = {
        teal: "group-hover/card:text-secondary",
        red: "group-hover/card:text-accent1",
        pink: "group-hover/card:text-accent2",
        gold: "group-hover/card:text-cta",
    };

    const strongHoverMap = {
        teal: "[&_strong]:group-hover/card:text-secondary",
        red: "[&_strong]:group-hover/card:text-accent1",
        pink: "[&_strong]:group-hover/card:text-accent2",
        gold: "[&_strong]:group-hover/card:text-cta",
    }

    return (
        <div className={cn(
            "group/card relative bg-[#0F0F11] border rounded-2xl overflow-hidden flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl",
            borderMap[variant],
            className
        )}>
            {/* Background Gradient Streak - Rainbow Rays */}
            <div
                className="absolute inset-0 opacity-60 group-hover/card:opacity-100 transition-opacity duration-700 pointer-events-none mix-blend-screen filter blur-xl"
                style={{ background: raysGradientMap[variant] }}
            />
            {/* Vertical glow layer */}
            <div
                className={cn(
                    "absolute inset-0 bg-linear-to-b from-white/10 to-transparent opacity-20 group-hover/card:opacity-40 transition-opacity duration-500 pointer-events-none"
                )}
            />

            <div className="p-8 flex-1 relative z-10">
                <h3 className={cn("text-xl font-bold text-white mb-2 font-heading leading-tight transition-colors duration-300", textHoverMap[variant])}>
                    {title}
                </h3>
                {subtitle && (
                    <p className="text-white/50 text-[10px] uppercase tracking-widest mb-4 font-bold font-heading opacity-90">
                        {subtitle}
                    </p>
                )}
                <p className="text-white/80 leading-relaxed font-body text-sm">
                    {description}
                </p>

                {/* Optional: Add "DLA KOGO" here if passed, or handle inside description/values */}
            </div>

            {values && (
                <div className="border-t border-white/5 bg-black/20 relative z-10 backdrop-blur-sm">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={cn(
                            "w-full flex items-center justify-between p-4 text-left text-xs font-bold uppercase tracking-wider text-white/50 transition-colors font-heading hover:text-white",
                            isOpen && textHoverMap[variant]
                        )}
                    >
                        <span>Wartość i efekty</span>
                        {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <div className={cn(
                        "overflow-hidden transition-all duration-300 ease-in-out px-4",
                        isOpen ? "max-h-[500px] pb-6 opacity-100" : "max-h-0 opacity-0"
                    )}>
                        <div className={cn("pt-2 text-sm text-white/70 font-body space-y-2 [&_strong]:transition-colors", strongHoverMap[variant])}>
                            {values}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
