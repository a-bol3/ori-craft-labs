import type { MetadataRoute } from "next";
import { dbConnect } from "@/lib/db";
import { InsightPost } from "@/lib/models/InsightPost";
import { Event } from "@/lib/models/Event";

const base = "https://ori-craftlabs.com";
const routes = ["", "/about", "/services", "/offers", "/insights", "/events", "/partners", "/history", "/faq", "/contact", "/legal", "/privacy", "/terms", "/cookies"];

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly" as const,
    priority: route === "" ? 1 : 0.6,
    alternates: {
      languages: {
        pl: `${base}${route}`,
        en: `${base}/en${route}`,
        es: `${base}/es${route}`,
      },
    },
  }));
  try {
    await dbConnect();
    const [posts, events] = await Promise.all([
      InsightPost.find({ status: "published" }).lean(),
      Event.find({ status: "published" }).lean(),
    ]);
    for (const item of posts as any[]) {
      const prefix = item.locale === "pl" ? "" : `/${item.locale}`;
      entries.push({ url: `${base}${prefix}/insights/${item.slug}`, changeFrequency: "monthly", priority: 0.5 });
    }
    for (const item of events as any[]) {
      const prefix = item.locale === "pl" ? "" : `/${item.locale}`;
      entries.push({ url: `${base}${prefix}/events/${item.slug}`, changeFrequency: "weekly", priority: 0.5 });
    }
  } catch {
    // The sitemap remains valid even while the database is unavailable.
  }
  return entries;
}
