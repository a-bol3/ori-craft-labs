// src/app/dashboard/admin/layout.tsx
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role;

  // ❗ Only admins allowed here
  if (role !== "admin") {
    redirect("/dashboard"); // send non-admins away
  }

  return (
    <div className="min-h-screen bg-brand text-white">
      <header className="border-b border-white/10 bg-black/30 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-heading font-bold">
              Ori Craft Labs – Admin Panel
            </h1>
            <p className="text-xs text-white/60 font-body">
              Zalogowany jako:{" "}
              <span className="font-semibold">
                {session.user?.email || "Admin"}
              </span>
            </p>
          </div>

          <nav className="flex gap-4 text-sm font-body">
            <Link
              href="/dashboard/admin"
              className="text-white/80 hover:text-cta font-medium"
            >
              Przegląd
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="text-white/80 hover:text-cta"
            >
              Użytkownicy
            </Link>
            <Link
              href="/dashboard/admin/cms"
              className="text-white/80 hover:text-cta"
            >
              CMS
            </Link>
            <Link
              href="/dashboard/admin/finance"
              className="text-white/80 hover:text-cta"
            >
              Finanse
            </Link>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
