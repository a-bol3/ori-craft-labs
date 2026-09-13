"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/ui/logo";
import { GlowingButton } from "@/components/ui/glowing-button";
import { locales, messages } from "@/lib/i18n";
import { getLocaleFromPathname, localizedHref, localizedPath } from "@/lib/locale-routing";

export function Navbar() {
    const pathname = usePathname() || "/";
    const locale = getLocaleFromPathname(pathname);
    const copy = messages[locale];
    const links = [
        { href: "/services", label: copy.nav.services },
        { href: "/offers", label: copy.nav.offers },
        { href: "/insights", label: copy.nav.insights },
        { href: "/about", label: copy.nav.about },
        { href: "/contact", label: copy.nav.contact },
    ];
    const isAdminArea = pathname.startsWith("/dashboard");

    const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        if (pathname === "/" || /^\/(pl|en|es)$/.test(pathname)) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-transparent backdrop-blur-[2px]">
            <div className="flex-1">
                <Link
                    href={locale === "pl" ? "/" : `/${locale}`}
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
                        href={localizedPath(link.href, locale)}
                        className="text-white/80 hover:text-white transition-colors text-sm uppercase tracking-wide font-medium font-heading"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>

            <div className="flex-1 flex justify-end">
                {!isAdminArea && <div className="mr-4 hidden gap-2 text-xs uppercase tracking-widest text-white/60 sm:flex">
                    {locales.map((targetLocale) => (
                        <Link
                            key={targetLocale}
                            href={localizedHref(pathname, targetLocale)}
                            aria-current={targetLocale === locale ? "page" : undefined}
                            className={targetLocale === locale ? "text-cta" : "hover:text-cta"}
                        >
                            {targetLocale.toUpperCase()}
                        </Link>
                    ))}
                </div>}
                <GlowingButton href={localizedPath("/contact", locale)}>
                    {copy.nav.contactCta}
                </GlowingButton>
            </div>
        </nav>
    );
}
