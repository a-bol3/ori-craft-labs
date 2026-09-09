import { contentRevisions } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";

export const ContentRevision = createSqlModel(contentRevisions);
