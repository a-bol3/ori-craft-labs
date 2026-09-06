// src/lib/legal.ts
import { dbConnect } from "./db";
import { LegalPage, LegalSlug } from "./models/LegalPage";

export async function getLegalPage(
  slug: LegalSlug,
  locale: "pl" | "en" | "es" = "pl"
) {
  await dbConnect();
  const page = await LegalPage.findOne({ slug, locale, isActive: true })
    .sort({ updatedAt: -1 })
    .lean();

  return page;
}
