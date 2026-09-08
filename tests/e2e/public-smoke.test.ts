import { describe, expect, it } from "vitest";

const baseUrl = process.env.E2E_BASE_URL?.replace(/\/$/, "");

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
});
