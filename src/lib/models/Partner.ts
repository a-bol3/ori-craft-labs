import { partners } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export type PartnerType = "cafe" | "physio" | "culture-space" | "other";
export const Partner = createSqlModel(partners);
