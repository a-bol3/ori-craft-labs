// src/app/dashboard/layout.tsx
import { ReactNode } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If not logged in → go to login page
  if (!session || (session.user as any).role !== "admin") {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-brand text-white">
      <div className="container mx-auto px-6 py-8">{children}</div>
    </main>
  );
}
