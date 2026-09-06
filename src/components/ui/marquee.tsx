"use client";

import { cn } from "@/lib/utils";

interface MarqueeProps {
    children: React.ReactNode;
    direction?: "left" | "right";
    pauseOnHover?: boolean;
    className?: string;
    speed?: number; // Duration in seconds
}

export function Marquee({
    children,
    direction = "left",
    pauseOnHover = false,
    className,
    speed = 40,
}: MarqueeProps) {
    return (
        <div className={cn("overflow-hidden flex w-full group", className)}>
            <div
                className={cn(
                    "flex shrink-0 gap-8 py-8 min-w-full",
                    direction === "left" ? "animate-scroll-left" : "animate-scroll-right",
                    pauseOnHover && "group-hover:[animation-play-state:paused]"
                )}
                style={{ animationDuration: `${speed}s` }}
            >
                {children}
                {children}
            </div>
        </div>
    );
}
