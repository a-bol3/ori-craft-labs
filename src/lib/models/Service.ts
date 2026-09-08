import { services } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export type ServiceSection = "wellbeing-movement" | "culture-in-motion" | "flavors-kitchen" | "education-schools" | "corporate-organizations" | "community-private";
export const Service = createSqlModel(services);
