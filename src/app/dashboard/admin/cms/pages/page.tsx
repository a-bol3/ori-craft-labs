"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";

type PageFormState = {
  _id?: string;
  slug: string;
  locale: "pl" | "en" | "es";
  title: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  content: string;
  showInNav: boolean;
  navLabel: string;
  order: number;
  status: "draft" | "published";
  isActive: boolean;
};

const EMPTY_FORM: PageFormState = {
  slug: "",
  locale: "pl",
  title: "",
  heroTitle: "",
  heroSubtitle: "",
  intro: "",
  content: "",
  showInNav: false,
  navLabel: "",
  order: 0,
  status: "draft",
  isActive: true,
};

export default function CmsPagesBuilderPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [form, setForm] = useState<PageFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadPages(locale = form.locale) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/pages?locale=${locale}`);
      const data = await res.json();
      setPages(data.pages || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function editPage(p: any) {
    setForm({
      _id: p._id,
      slug: p.slug,
      locale: p.locale,
      title: p.title,
      heroTitle: p.heroTitle || p.title,
      heroSubtitle: p.heroSubtitle || "",
      intro: p.intro || "",
      content: p.content || "",
      showInNav: p.showInNav ?? false,
      navLabel: p.navLabel || "",
      order: p.order ?? 0,
      status: p.status || "draft",
      isActive: p.isActive ?? true,
    });
    setMessage(null);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setMessage(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error saving page");
      } else {
        setMessage("Page saved ✅");
        await loadPages(form.locale);
        if (data.page?._id) {
          editPage(data.page);
        }
      }
    } catch (e) {
      console.error(e);
      setMessage("Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this page?")) return;
    await fetch(`/api/admin/pages?id=${id}`, { method: "DELETE" });
    if (form._id === id) resetForm();
    await loadPages(form.locale);
  }

  function handleLocaleChange(locale: "pl" | "en" | "es") {
    setForm((f) => ({ ...f, locale }));
    loadPages(locale);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,1.2fr] gap-8">
      {/* LEFT: form */}
      <div className="p-6 rounded-2xl bg-black/30 border border-white/10">
        <h1 className="text-2xl font-bold mb-4 text-white">
          New pages / sections builder
        </h1>
        <p className="text-sm text-white/60 mb-6">
          Create custom static pages like{" "}
          <span className="font-semibold">/pages/schools</span> or{" "}
          <span className="font-semibold">/pages/corporate</span>. You can
          control title, content and if it should appear in navigation.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          {/* slug + locale + status */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Slug (url)
              </label>
              <div className="flex items-center gap-1 text-xs text-white/60 mb-1">
                <span>/pages/</span>
                <span className="text-cta">
                  {form.slug || "twoj-slug"}
                </span>
              </div>
              <input
                className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white"
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="schools"
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">
                Locale
              </label>
              <select
                className="w-full bg-black/40 border border-white/20 rounded px-2 py-2 text-xs text-white"
                value={form.locale}
                onChange={(e) =>
                  handleLocaleChange(e.target.value as "pl" | "en" | "es")
                }
              >
                <option value="pl">PL</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">
                Status
              </label>
              <select
                className="w-full bg-black/40 border border-white/20 rounded px-2 py-2 text-xs text-white"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    status: e.target.value as "draft" | "published",
                  }))
                }
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
          </div>

          {/* titles */}
          <div>
            <label className="block text-xs text-white/60 mb-1">
              Page title
            </label>
            <input
              className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white"
              value={form.title}
              onChange={(e) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Hero title (optional)
              </label>
              <input
                className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white"
                value={form.heroTitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, heroTitle: e.target.value }))
                }
                placeholder="Main big headline"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Hero subtitle (optional)
              </label>
              <input
                className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white"
                value={form.heroSubtitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, heroSubtitle: e.target.value }))
                }
                placeholder="Short one line under hero"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">
              Intro (lead paragraph)
            </label>
            <textarea
              rows={3}
              className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white"
              value={form.intro}
              onChange={(e) =>
                setForm((f) => ({ ...f, intro: e.target.value }))
              }
            />
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">
              Main content (simple text or markdown)
            </label>
            <textarea
              rows={10}
              className="w-full bg-black/40 border border-white/20 rounded px-3 py-2 text-sm text-white font-mono"
              value={form.content}
              onChange={(e) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
            />
          </div>

          {/* nav + order */}
          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={form.showInNav}
                onChange={(e) =>
                  setForm((f) => ({ ...f, showInNav: e.target.checked }))
                }
              />
              Show this page in navigation
            </label>

            <div className="flex items-center gap-2 text-xs text-white/60">
              <span>Nav label:</span>
              <input
                className="w-32 bg-black/40 border border-white/20 rounded px-2 py-1 text-xs text-white"
                value={form.navLabel}
                onChange={(e) =>
                  setForm((f) => ({ ...f, navLabel: e.target.value }))
                }
                placeholder="Schools"
              />
              <span className="ml-4">Order:</span>
              <input
                type="number"
                className="w-16 bg-black/40 border border-white/20 rounded px-2 py-1 text-xs text-white"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          {/* active + actions */}
          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              Active (visible on website when published)
            </label>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-xs font-semibold rounded-full border border-white/40 text-white/80 hover:bg-white/10"
              >
                New / Reset
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2 text-xs font-semibold rounded-full bg-cta text-brand hover:bg-[#ffc666]"
              >
                {saving ? "Saving..." : "Save page"}
              </button>
            </div>
          </div>

          {message && (
            <p className="text-xs text-emerald-300 mt-2">{message}</p>
          )}
        </form>
      </div>

      {/* RIGHT: list of pages */}
      <div className="p-4 rounded-2xl bg-black/20 border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">
            Existing pages ({form.locale.toUpperCase()})
          </h2>
          {loading && (
            <span className="text-xs text-white/60 animate-pulse">
              Loading...
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {pages.map((p) => (
            <div
              key={p._id}
              className="flex items-start justify-between gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80"
            >
              <div className="cursor-pointer" onClick={() => editPage(p)}>
                <div className="font-semibold">
                  /pages/{p.slug} · {p.title}
                  {!p.isActive && (
                    <span className="ml-2 text-[10px] text-red-300">
                      (inactive)
                    </span>
                  )}
                  {p.status === "draft" && (
                    <span className="ml-2 text-[10px] text-yellow-300">
                      draft
                    </span>
                  )}
                </div>
                <div className="text-white/50 text-[11px]">
                  {p.showInNav
                    ? `Nav: ${p.navLabel || p.title} · order ${p.order ?? 0}`
                    : "Not in navigation"}
                </div>
              </div>
              <button
                className="text-red-300 hover:text-red-200 text-[11px]"
                onClick={() => handleDelete(p._id)}
              >
                Delete
              </button>
            </div>
          ))}

          {pages.length === 0 && !loading && (
            <p className="text-xs text-white/50">
              No pages yet – create the first one on the left.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
