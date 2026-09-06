"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface GlowingButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
    innerClassName?: string;
    variant?: "default" | "gold";
}

export function GlowingButton({ href, children, className, innerClassName, variant = "default", ...props }: GlowingButtonProps) {
    const isGold = variant === "gold";

    return (
        <Link
            href={href}
            className={cn(
                "relative inline-flex items-center justify-center rounded-full p-px overflow-hidden group focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50 transition-transform active:scale-95",
                className
            )}
            {...props}
        >
            {/* The moving gradient border */}
            <span className={cn(
                "absolute inset-[-1000%] animate-[spin_2s_linear_infinite]",
                isGold
                    ? "bg-[conic-gradient(from_90deg_at_50%_50%,#0F0F11_0%,#4A4A4A_50%,#0F0F11_100%)]"
                    : "bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]"
            )} />

            {/* The inner button content */}
            <span className={cn(
                "relative inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full px-6 py-2 text-sm font-medium backdrop-blur-3xl font-heading tracking-wide uppercase transition-colors",
                isGold
                    ? "bg-cta text-brand group-hover:bg-[#ffc666]"
                    : "bg-slate-950 text-cta group-hover:bg-slate-900",
                innerClassName
            )}>
                {children}
            </span>
        </Link>
    );
}
