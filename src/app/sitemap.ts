import type { MetadataRoute } from "next";

const base = "https://ori-craftlabs.com";
const routes = ["", "/about", "/services", "/offers", "/insights", "/partners", "/history", "/faq", "/contact", "/legal", "/privacy", "/terms", "/cookies"];

export default function sitemap(): MetadataRoute.Sitemap {
  return routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.6,
    alternates: {
      languages: {
        pl: `${base}${route}`,
        en: `${base}/en${route}`,
        es: `${base}/es${route}`,
      },
    },
  }));
}
