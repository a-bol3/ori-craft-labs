import { mediaAssets } from "@/lib/schema";
import { createSqlModel } from "@/lib/sql-model";
export type MediaType = "image" | "video";
export const MediaAsset = createSqlModel(mediaAssets);
