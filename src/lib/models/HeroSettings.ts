import { heroSettings } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export const HeroSettings = createSqlModel(heroSettings);
