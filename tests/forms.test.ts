import { describe, expect, it } from "vitest";
import { z } from "zod";

const contactSchema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().toLowerCase().email().max(254),
  subject: z.string().trim().min(2).max(160),
  message: z.string().trim().min(10).max(5000),
  consent: z.literal(true),
});

describe("public form contracts", () => {
  it("rejects missing consent", () => {
    expect(contactSchema.safeParse({ name: "Ada", email: "ada@example.com", subject: "Hello", message: "A sufficiently long message", consent: false }).success).toBe(false);
  });
  it("normalizes valid email input", () => {
    const result = contactSchema.parse({ name: "Ada", email: " ADA@EXAMPLE.COM ", subject: "Hello", message: "A sufficiently long message", consent: true });
    expect(result.email).toBe("ada@example.com");
  });
});
