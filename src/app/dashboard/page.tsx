// src/app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardIndexPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session.user as any).role || "client";

  if (role === "admin") {
    redirect("/dashboard/admin");
  }

  // For now, all non-admin roles see this placeholder.
  // Later we will build proper dashboards for each role.
  return (
    <section className="space-y-4">
      <h1 className="text-2xl font-heading font-bold">
        Dashboard - coming soon
      </h1>
      <p className="text-white/80 font-body">
        Twoja rola: <span className="font-semibold">{role}</span>.
      </p>
      <p className="text-white/60 font-body">
        Wkrótce pojawi się tutaj widok dopasowany do Twojej roli.
      </p>
    </section>
  );
}
