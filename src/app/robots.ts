import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/dashboard/", "/api/", "/login", "/debug-db"] }],
    sitemap: "https://ori-craftlabs.com/sitemap.xml",
    host: "https://ori-craftlabs.com",
  };
}
