import { and, eq, gt } from "drizzle-orm";
import { randomUUID } from "node:crypto";
import { getDb } from "@/lib/db";

type AnyTable = any;
type Filter = Record<string, unknown>;
type Update = Record<string, unknown>;

function normalize(value: unknown) {
  if (value && typeof value === "object" && "_id" in (value as object)) return (value as any)._id;
  return value;
}

function matches(row: any, filter: Filter) {
  return Object.entries(filter).every(([key, expected]) => {
    const actual = key === "_id" ? row.id : row[key];
    if (expected && typeof expected === "object" && "$gt" in (expected as any)) return actual > (expected as any).$gt;
    return actual === normalize(expected);
  });
}

function document(row: any) { return row ? { ...row, _id: row.id } : null; }

function promiseQuery<T>(promise: Promise<T>) {
  const result = promise as Promise<T> & { lean: () => Promise<T> };
  result.lean = () => promise;
  return result;
}

async function rows(table: AnyTable, filter: Filter = {}) {
  const predicates = Object.entries(filter).map(([key, expected]) => {
    const column = table[key === "_id" ? "id" : key];
    if (!column) return undefined;
    if (expected && typeof expected === "object" && "$gt" in (expected as any)) return gt(column, (expected as any).$gt);
    return eq(column, normalize(expected));
  }).filter(Boolean);
  const result = predicates.length ? await getDb().select().from(table).where(and(...predicates)) : await getDb().select().from(table);
  return result;
}

function applyUpdate(current: any, update: Update) {
  const next = { ...current };
  const set = (update.$set ?? update) as Record<string, unknown>;
  for (const [key, value] of Object.entries(set)) if (!key.startsWith("$")) next[key === "_id" ? "id" : key] = value;
  for (const [key, value] of Object.entries((update.$inc ?? {}) as Record<string, number>)) next[key] = Number(next[key] ?? 0) + value;
  for (const key of Object.keys((update.$unset ?? {}) as Record<string, unknown>)) next[key] = null;
  return next;
}

async function persist(table: AnyTable, value: any) {
  const [saved] = await getDb().update(table).set({ ...value, updatedAt: new Date() }).where(eq(table.id, value.id)).returning();
  return document(saved);
}

function query(table: AnyTable, filter: Filter = {}) {
  let sortSpec: { field: string; direction: "asc" | "desc" } | null = null;
  const api = {
    sort(spec: Record<string, 1 | -1>) { const [field, direction] = Object.entries(spec)[0] ?? []; if (field) sortSpec = { field, direction: direction === -1 ? "desc" : "asc" }; return api; },
    async lean() {
      const result = (await rows(table, filter)).map(document);
      if (sortSpec) result.sort((a: any, b: any) => { const cmp = a[sortSpec!.field] > b[sortSpec!.field] ? 1 : a[sortSpec!.field] < b[sortSpec!.field] ? -1 : 0; return sortSpec!.direction === "desc" ? -cmp : cmp; });
      return result;
    },
    then<TResult1 = any, TResult2 = never>(onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null) { return api.lean().then(onfulfilled, onrejected); },
  };
  return api;
}

export function createSqlModel(table: AnyTable) {
  const model = {
    find(filter: Filter = {}) { return query(table, filter); },
    findOne(filter: Filter = {}) {
      let sortSpec: { field: string; direction: "asc" | "desc" } | null = null;
      const result = {
        sort(spec: Record<string, 1 | -1>) { const [field, direction] = Object.entries(spec)[0] ?? []; if (field) sortSpec = { field, direction: direction === -1 ? "desc" : "asc" }; return result; },
        async lean() { const found = await rows(table, filter); if (sortSpec) found.sort((a: any, b: any) => { const cmp = a[sortSpec!.field] > b[sortSpec!.field] ? 1 : a[sortSpec!.field] < b[sortSpec!.field] ? -1 : 0; return sortSpec!.direction === "desc" ? -cmp : cmp; }); return document(found[0]); },
        then<TResult1 = any, TResult2 = never>(onfulfilled?: ((value: any) => TResult1 | PromiseLike<TResult1>) | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | null) { return result.lean().then(onfulfilled, onrejected); },
      };
      return result;
    },
    async create(input: Record<string, unknown>) { const value = { id: String(input._id ?? input.id ?? randomUUID()), ...input } as any; delete value._id; const now = new Date(); value.createdAt ??= now; value.updatedAt ??= now; const insertedRows = await getDb().insert(table).values(value).returning() as any[]; return document(insertedRows[0]); },
    findByIdAndUpdate(id: string, update: Update, options: { new?: boolean } = {}) { return promiseQuery((async () => { const current = (await rows(table, { _id: id }))[0]; if (!current) return null; const saved = await persist(table, applyUpdate(current, update)); return options.new === false ? document(current) : saved; })()); },
    findOneAndUpdate(filter: Filter, update: Update, options: { upsert?: boolean; new?: boolean } = {}) { return promiseQuery((async () => { const current = (await rows(table, filter))[0]; if (!current && options.upsert) return model.create({ ...((update.$setOnInsert ?? {}) as any), ...((update.$set ?? {}) as any), ...filter }); if (!current) return null; if (update.$setOnInsert && !update.$set && !update.$inc && !update.$unset) return document(current); const saved = await persist(table, applyUpdate(current, update)); return options.new === false ? document(current) : saved; })()); },
    async findByIdAndDelete(id: string) { const current = (await rows(table, { _id: id }))[0]; if (!current) return null; await getDb().delete(table).where(eq(table.id, id)); return document(current); },
    async countDocuments(filter: Filter = {}) { return (await rows(table, filter)).length; },
    async bulkWrite(operations: any[]) { for (const operation of operations) { const updateOne = operation.updateOne; if (updateOne) await model.findOneAndUpdate(updateOne.filter, updateOne.update, { upsert: updateOne.upsert, new: true }); } },
  };
  return model;
}
