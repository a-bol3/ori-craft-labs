// src/components/ui/button.tsx
"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "outline";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
}

export function Button({
  variant = "primary",
  className,
  children,
  ...props
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center rounded-full text-xs font-semibold uppercase tracking-wide transition focus:outline-none focus:ring-2 focus:ring-cta focus:ring-offset-2 focus:ring-offset-brand disabled:opacity-60 disabled:cursor-not-allowed";

  const styles =
    variant === "outline"
      ? "border border-white/40 bg-transparent text-white/80 hover:bg-white/10"
      : "bg-cta text-brand px-6 py-2 hover:bg-[#ffc666]";

  return (
    <button className={cn(base, styles, className)} {...props}>
      {children}
    </button>
  );
}
