import type { Metadata } from "next";
import { InsightsList } from "@/components/marketing/insights-list";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Aktualności",
  alternates: {
    canonical: "/insights",
    languages: { pl: "/insights", en: "/en/insights", es: "/es/insights" },
  },
};

export default function InsightsPage() {
  return <InsightsList locale="pl" />;
}
