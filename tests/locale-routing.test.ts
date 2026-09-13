import { describe, expect, it } from "vitest";
import { getLocaleFromPathname, localizedHref, localizedPath } from "@/lib/locale-routing";

describe("localized public routes", () => {
  it("detects the active locale and keeps the current section when changing languages", () => {
    expect(getLocaleFromPathname("/en/offers")).toBe("en");
    expect(getLocaleFromPathname("/insights")).toBe("pl");
    expect(localizedHref("/about", "en")).toBe("/en/about");
    expect(localizedHref("/en/about", "es")).toBe("/es/about");
    expect(localizedHref("/es/offers", "pl")).toBe("/offers");
    expect(localizedHref("/en/insights", "en")).toBe("/en/insights");
  });

  it("falls back to the translated Insights list when a post has no translation mapping", () => {
    expect(localizedHref("/insights/polish-only-slug", "en")).toBe("/en/insights");
    expect(localizedHref("/en/insights/english-only-slug", "pl")).toBe("/insights");
  });

  it("does not route unsupported sections to a broken localized URL", () => {
    expect(localizedHref("/events", "es")).toBe("/es");
    expect(localizedPath("/insights/polish-only-slug", "es")).toBe("/es/insights");
  });
});
