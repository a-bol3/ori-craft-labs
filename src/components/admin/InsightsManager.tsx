// src/components/admin/InsightsManager.tsx
"use client";

import { useState } from "react";

type InsightPost = {
  id: string;
  title: string;
  slug: string;
  category: string;
  locale: "pl" | "en" | "es";
  excerpt: string;
  content: string;
  publishedAt: string | null;
  status?: "draft" | "review" | "published" | "archived";
  version?: number;
};

const categories = [
  { value: "movement", label: "Movement" },
  { value: "rituals", label: "Rituals" },
  { value: "body-awareness", label: "Body awareness" },
  { value: "culture", label: "Culture" },
  { value: "other", label: "Other" },
];

export function InsightsManager({ initialPosts }: { initialPosts: InsightPost[] }) {
  const [posts, setPosts] = useState<InsightPost[]>(initialPosts);
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [newPost, setNewPost] = useState<Omit<InsightPost, "id" | "publishedAt">>({
    title: "",
    slug: "",
    category: "movement",
    locale: "pl",
    excerpt: "",
    content: "",
  } as any);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  function handleNewChange(field: keyof typeof newPost, value: string) {
    setNewPost((prev) => ({ ...prev, [field]: value }));
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreating(true);

    try {
      const res = await fetch("/api/admin/insights", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error creating post");
      }

      const post = data.post as InsightPost;
      setPosts((prev) => [post, ...prev]);

      setNewPost({
        title: "",
        slug: "",
        category: "movement",
        locale: "pl",
        excerpt: "",
        content: "",
      } as any);
    } catch (err: any) {
      console.error("CREATE_INSIGHT_ERROR:", err);
      setCreateError(err.message || "Something went wrong");
    } finally {
      setCreating(false);
    }
  }

  async function handleUpdate(id: string, patch: Partial<InsightPost>) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/insights/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(patch),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error updating post");
      }

      setPosts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...patch } : p))
      );
    } catch (err) {
      console.error("UPDATE_INSIGHT_ERROR:", err);
      alert("Could not update post. Check console.");
    } finally {
      setSavingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm("Are you sure you want to delete this post?")) {
      return;
    }

    setDeletingId(id);
    try {
      const res = await fetch(`/api/admin/insights/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error deleting post");
      }

      setPosts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error("DELETE_INSIGHT_ERROR:", err);
      alert("Could not delete post. Check console.");
    } finally {
      setDeletingId(null);
    }
  }

  async function handlePublish(id: string) {
    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/insights/${id}`, { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || "Error publishing post");
      setPosts((prev) => prev.map((post) => post.id === id ? { ...post, ...data.post } : post));
    } catch (error) {
      console.error("PUBLISH_INSIGHT_ERROR:", error);
      alert("Could not publish post. Check the fields and try again.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="space-y-8">
      {/* CREATE FORM */}
      <div className="rounded-3xl border border-white/10 bg-black/30 p-5 shadow-xl shadow-black/50">
        <h3 className="text-lg font-heading font-semibold mb-3">
          Create new insight
        </h3>
        <p className="text-sm text-white/70 font-body mb-4">
          Short stories, reflections and inspirations for the Insights section.
        </p>

        <form className="grid gap-4 md:grid-cols-2" onSubmit={handleCreate}>
          <div className="md:col-span-2">
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Title
            </label>
            <input
              type="text"
              value={newPost.title}
              required
              onChange={(e) => handleNewChange("title", e.target.value)}
              className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
              placeholder="Why slow movement can be more powerful"
            />
          </div>

          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Slug
            </label>
            <input
              type="text"
              value={newPost.slug}
              required
              onChange={(e) => handleNewChange("slug", e.target.value)}
              className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
              placeholder="slow-movement-power"
            />
          </div>

          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Category
            </label>
            <select
              value={newPost.category}
              onChange={(e) => handleNewChange("category", e.target.value)}
              className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Locale
            </label>
            <select
              value={newPost.locale}
              onChange={(e) => handleNewChange("locale", e.target.value)}
              className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
            >
              <option value="pl">Polish</option>
              <option value="en">English</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Excerpt
            </label>
            <textarea
              value={newPost.excerpt}
              required
              onChange={(e) => handleNewChange("excerpt", e.target.value)}
              className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
              placeholder="Short teaser that appears on cards."
              rows={2}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Content
            </label>
            <textarea
              value={newPost.content}
              required
              onChange={(e) => handleNewChange("content", e.target.value)}
              className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
              placeholder="Full text of the insight..."
              rows={5}
            />
          </div>

          <div className="md:col-span-2 flex items-center justify-between gap-4">
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 bg-cta text-black rounded-full text-sm font-heading font-semibold uppercase tracking-widest shadow-md shadow-cta/30 hover:bg-cta/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {creating ? "Creating..." : "Create post"}
            </button>

            {createError && (
              <p className="text-xs text-red-400 font-body">{createError}</p>
            )}
          </div>
        </form>
      </div>

      {/* EXISTING POSTS */}
      <div className="space-y-4">
        {posts.length === 0 ? (
          <p className="text-sm text-white/70 font-body">
            No insight posts yet. Create your first one above.
          </p>
        ) : (
          posts.map((p) => (
            <article
              key={p.id}
              className="rounded-3xl border border-white/10 bg-black/30 p-4 md:p-5 shadow-lg shadow-black/40 space-y-3"
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-3 py-1 rounded-full text-xs uppercase tracking-widest bg-white/10 text-white/80">
                    {p.locale}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/80">
                    {p.category}
                  </span>
                  <span className="px-3 py-1 rounded-full text-xs bg-white/10 text-white/60">
                    {p.slug}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs ${p.status === "published" ? "bg-emerald-400/20 text-emerald-200" : "bg-amber-400/20 text-amber-200"}`}>
                    {p.status || "draft"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {p.status !== "published" && <button type="button" onClick={() => handlePublish(p.id)} disabled={savingId === p.id} className="px-3 py-1 rounded-full text-xs font-semibold bg-cta text-black hover:bg-cta/90 transition-colors disabled:opacity-60">{savingId === p.id ? "Publishing..." : "Publish"}</button>}
                  <button
                    type="button"
                    onClick={() => handleDelete(p.id)}
                    disabled={deletingId === p.id}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/80 text-black hover:bg-red-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {deletingId === p.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  value={p.title}
                  onChange={(e) =>
                    setPosts((prev) =>
                      prev.map((x) =>
                        x.id === p.id ? { ...x, title: e.target.value } : x
                      )
                    )
                  }
                  onBlur={(e) => handleUpdate(p.id, { title: e.target.value })}
                  className="w-full bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-sm text-white font-heading focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta"
                />
                <textarea
                  value={p.excerpt}
                  onChange={(e) =>
                    setPosts((prev) =>
                      prev.map((x) =>
                        x.id === p.id ? { ...x, excerpt: e.target.value } : x
                      )
                    )
                  }
                  onBlur={(e) =>
                    handleUpdate(p.id, { excerpt: e.target.value })
                  }
                  className="w-full bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-xs text-white/90 font-body focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta"
                  rows={2}
                />
                <textarea
                  value={p.content}
                  onChange={(e) =>
                    setPosts((prev) =>
                      prev.map((x) =>
                        x.id === p.id ? { ...x, content: e.target.value } : x
                      )
                    )
                  }
                  onBlur={(e) =>
                    handleUpdate(p.id, { content: e.target.value })
                  }
                  className="w-full bg-black/20 border border-white/15 rounded-lg px-3 py-2 text-xs text-white/90 font-body focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta"
                  rows={4}
                />
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
