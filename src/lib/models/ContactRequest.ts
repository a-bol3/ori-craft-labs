import { contactRequests } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export const ContactRequest = createSqlModel(contactRequests);
