import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";
import { auditLogs, contentRevisions } from "@/lib/schema";

export const editorialStatuses = ["draft", "review", "published", "archived"] as const;
export type EditorialStatus = (typeof editorialStatuses)[number];

export function isEditorialStatus(value: unknown): value is EditorialStatus {
  return typeof value === "string" && editorialStatuses.includes(value as EditorialStatus);
}

export async function recordRevision(input: {
  entityType: string;
  entityId: string;
  locale: "pl" | "en" | "es";
  version: number;
  status: EditorialStatus;
  payload: Record<string, unknown>;
  createdBy?: string;
  note?: string;
}) {
  return getDb().insert(contentRevisions).values({
    id: randomUUID(),
    entityType: input.entityType,
    entityId: input.entityId,
    locale: input.locale,
    version: input.version,
    status: input.status,
    payload: input.payload,
    createdBy: input.createdBy,
    note: input.note,
    publishedAt: input.status === "published" ? new Date() : null,
  }).returning();
}

export async function recordAudit(input: {
  actorUserId?: string;
  action: string;
  entity: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}) {
  return getDb().insert(auditLogs).values({
    id: randomUUID(),
    actorUserId: input.actorUserId,
    action: input.action,
    entity: input.entity,
    entityId: input.entityId,
    metadata: input.metadata ?? {},
    createdAt: new Date(),
  });
}

export function revisionPayload(value: Record<string, unknown>) {
  const payload = { ...value };
  delete payload._id;
  delete payload.createdAt;
  delete payload.updatedAt;
  return payload;
}
