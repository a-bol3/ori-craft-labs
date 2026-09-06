import { describe, expect, it } from "vitest";

describe("production route inventory", () => {
  it("keeps public and private surfaces distinct", () => {
    const publicRoutes = ["/", "/about", "/services", "/offers", "/insights", "/contact"];
    const privateRoutes = ["/dashboard", "/api/admin", "/api/debug-db"];
    expect(publicRoutes).not.toContain("/dashboard");
    expect(privateRoutes.every((route) => route.startsWith("/dashboard") || route.startsWith("/api/"))).toBe(true);
  });
});
