import { describe, expect, it } from "vitest";

const baseUrl = process.env.E2E_BASE_URL?.replace(/\/$/, "");
const draftInsightSlug = process.env.E2E_DRAFT_INSIGHT_SLUG;

describe("public deployment smoke test", () => {
  it.skipIf(!baseUrl)("serves the public landing and health endpoint", async () => {
    const [home, offers, health] = await Promise.all([
      fetch(`${baseUrl}/`),
      fetch(`${baseUrl}/offers`),
      fetch(`${baseUrl}/api/health`),
    ]);

    expect(home.ok).toBe(true);
    expect(offers.ok).toBe(true);
    expect(health.ok).toBe(true);
    expect(await health.json()).toMatchObject({ status: "ok", database: "ok" });
  });

  it.skipIf(!baseUrl || !draftInsightSlug)("keeps an unpublished insight private", async () => {
    const [listing, publicDetail, anonymousPreview, sitemap] = await Promise.all([
      fetch(`${baseUrl}/insights`),
      fetch(`${baseUrl}/insights/${encodeURIComponent(draftInsightSlug!)}`),
      fetch(`${baseUrl}/insights/${encodeURIComponent(draftInsightSlug!)}?preview=1`),
      fetch(`${baseUrl}/sitemap.xml`),
    ]);

    expect(listing.ok).toBe(true);
    expect(await listing.text()).not.toContain(draftInsightSlug);
    expect(publicDetail.status).toBe(404);
    expect(anonymousPreview.status).toBe(404);

    expect(sitemap.ok).toBe(true);
    expect(await sitemap.text()).not.toContain(draftInsightSlug);
  });
});
