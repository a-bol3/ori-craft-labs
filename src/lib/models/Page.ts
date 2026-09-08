import { pages } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export type PageStatus = "draft" | "review" | "published";
export const Page = createSqlModel(pages);
