import { notificationQueue } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";

export const NotificationQueue = createSqlModel(notificationQueue);
