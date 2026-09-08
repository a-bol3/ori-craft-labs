import { newsletterSubscribers } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export const NewsletterSubscriber = createSqlModel(newsletterSubscribers);
