// src/app/dashboard/admin/cms/layout.tsx
"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const cmsLinks = [
  { href: "/dashboard/admin/cms/hero", label: "Hero & homepage" },
  { href: "/dashboard/admin/cms/services", label: "Services" },
  { href: "/dashboard/admin/cms/offers", label: "Offers & Packages" },
  { href: "/dashboard/admin/cms/legal", label: "Legal pages" },
  { href: "/dashboard/admin/cms/partners", label: "Partners" },
  { href: "/dashboard/admin/cms/media", label: "Media (images, video)" },
];

export default function CmsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[260px,minmax(0,1fr)] gap-8">
      <aside className="rounded-2xl border border-white/10 bg-black/40 p-4 lg:p-6 h-fit">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-white/70 mb-4">
          Content CMS
        </h2>
        <nav className="space-y-1 text-sm">
          {cmsLinks.map((link) => {
            const active = pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "block rounded-lg px-3 py-2 text-xs font-medium tracking-wide transition-colors",
                  active
                    ? "bg-cta text-brand"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 pt-4 border-t border-white/10 text-[11px] text-white/40">
          <p className="font-semibold mb-1 uppercase tracking-wide">
            Coming soon
          </p>
          <p>New pages / sections builder (static + dynamic pages).</p>
        </div>
      </aside>

      <section>{children}</section>
    </div>
  );
}
