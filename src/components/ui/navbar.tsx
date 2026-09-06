"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "@/components/ui/logo";
import { GlowingButton } from "@/components/ui/glowing-button";

export function Navbar() {
    const links = [
        { href: "/services", label: "Usługi" },
        { href: "/offers", label: "Oferta" },
        { href: "/insights", label: "Inspiracje" },
        { href: "/about", label: "O nas" },
        { href: "/contact", label: "Kontakt" },
    ];

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (window.location.pathname === "/") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-transparent backdrop-blur-[2px]">
            <div className="flex-1">
                <Link
                    href="/"
                    onClick={handleLogoClick}
                    className="flex items-center"
                >
                    <Logo className="h-8 md:h-10 w-auto text-white" />
                </Link>
            </div>

            <div className="hidden md:flex flex-1 justify-center gap-8">
                {links.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-white/80 hover:text-white transition-colors text-sm uppercase tracking-wide font-medium font-heading"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="flex-1 flex justify-end">
                <div className="mr-4 hidden gap-2 text-xs uppercase tracking-widest text-white/60 sm:flex">
                    <Link href="/pl" className="hover:text-cta">PL</Link>
                    <Link href="/en" className="hover:text-cta">EN</Link>
                    <Link href="/es" className="hover:text-cta">ES</Link>
                </div>
                <GlowingButton href="/contact">
                    Sign In
                </GlowingButton>
            </div>
        </nav>
    );
}
