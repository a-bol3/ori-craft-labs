import { events } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";

export const Event = createSqlModel(events);
