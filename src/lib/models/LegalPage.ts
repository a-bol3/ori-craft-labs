import { legalPages } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export type LegalSlug = "terms-of-service" | "privacy-policy" | "cookie-policy" | "cookie-preferences";
export const LegalPage = createSqlModel(legalPages);
