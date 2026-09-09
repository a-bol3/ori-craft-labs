import { requests } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";

export const Request = createSqlModel(requests);
