import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { latestDraftRevision } from "@/lib/editorial";
import { InsightPost } from "@/lib/models/InsightPost";
import type { Locale } from "@/lib/i18n";

export async function getPublishedInsight(slug: string, locale: Locale) {
  await dbConnect();
  return InsightPost.findOne({ slug, locale, status: "published" }).lean();
}

export async function getPreviewInsight(slug: string, locale: Locale) {
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") return null;

  await dbConnect();
  const candidates = await InsightPost.find({ locale }).lean();
  const effectivePosts = await Promise.all(candidates.map(async (candidate: any) => {
    if (candidate.status === "archived") return null;

    const draft = await latestDraftRevision("insight", String(candidate.id ?? candidate._id));
    const effectivePost = draft && Number(draft.version) > Number(candidate.version ?? 0)
      ? {
          ...candidate,
          ...(draft.payload as Record<string, unknown>),
          status: draft.status,
          version: draft.version,
          publishedAt: null,
        }
      : candidate;

    if (
      effectivePost.locale !== locale ||
      !["draft", "review", "published"].includes(String(effectivePost.status))
    ) return null;
    return effectivePost.slug === slug ? effectivePost : null;
  }));

  return effectivePosts.find(Boolean) ?? null;
}
