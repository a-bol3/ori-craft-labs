import { offers } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export type OfferGroup = "children-youth" | "adults" | "corporate" | "cooking-tasting" | "culture-evening" | "team-offsite" | "retreats";
export const Offer = createSqlModel(offers);
