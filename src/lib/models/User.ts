import { users } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export type UserRole = "admin" | "client" | "partner" | "affiliate" | "employee";
export const User = createSqlModel(users);
