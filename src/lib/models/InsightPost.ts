import { insightPosts } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export type InsightCategory = "movement" | "rituals" | "body-awareness" | "culture" | "other";
export const InsightPost = createSqlModel(insightPosts);
