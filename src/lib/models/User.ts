// src/lib/models/User.ts
import mongoose, { Model, Schema, models } from "mongoose";

export type UserRole = "admin" | "client" | "partner" | "affiliate" | "employee";

export interface IUser {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  preferredLocale: "pl" | "en" | "es";
  createdAt?: Date;
  updatedAt?: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "client", "partner", "affiliate", "employee"],
      default: "client",
    },
    preferredLocale: {
      type: String,
      enum: ["pl", "en", "es"],
      default: "pl",
    },
  },
  {
    timestamps: true,
  }
);

// Avoid model overwrite in dev
export const User: Model<IUser> =
  models.User || mongoose.model<IUser>("User", UserSchema);
