// src/app/dashboard/admin/cms/media/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type MediaType = "image" | "video";

type MediaFormState = {
  _id?: string;
  title: string;
  slug: string;
  type: MediaType;
  url: string;
  thumbnailUrl: string;
  alt: string;
  tags: string; // comma separated in UI
  section: string;
  locale: "pl" | "en" | "es";
  order: number;
  isActive: boolean;
};

const EMPTY_FORM: MediaFormState = {
  title: "",
  slug: "",
  type: "image",
  url: "",
  thumbnailUrl: "",
  alt: "",
  tags: "",
  section: "",
  locale: "pl",
  order: 0,
  isActive: true,
};

export default function CmsMediaPage() {
  const [assets, setAssets] = useState<any[]>([]);
  const [form, setForm] = useState<MediaFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadAssets() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/media");
      const data = await res.json();
      setAssets(data.assets || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAssets();
  }, []);

  function editAsset(a: any) {
    setForm({
      _id: a._id,
      title: a.title || "",
      slug: a.slug || "",
      type: a.type || "image",
      url: a.url || "",
      thumbnailUrl: a.thumbnailUrl || "",
      alt: a.alt || "",
      tags: (a.tags || []).join(", "),
      section: a.section || "",
      locale: a.locale || "pl",
      order: a.order ?? 0,
      isActive: a.isActive ?? true,
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
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error saving media asset");
      } else {
        setMessage("Media asset saved ✅");
        await loadAssets();
        if (data.asset?._id) editAsset(data.asset);
      }
    } catch (e) {
      console.error(e);
      setMessage("Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this media asset?")) return;
    await fetch(`/api/admin/media?id=${id}`, { method: "DELETE" });
    if (form._id === id) resetForm();
    await loadAssets();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,1.2fr] gap-8">
      {/* LEFT: form */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold text-white mb-4">
          Media (images &amp; video)
        </h1>
        <p className="text-sm text-white/60 mb-6">
          Library of images and videos used across the site. For now you paste
          URLs (from your storage / CDN). Later we can hook a real uploader.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Title (internal)
              </label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Slug (unique)
              </label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="hero-background-main"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">Type</label>
              <select
                className="w-full rounded-lg border border-white/20 bg-black/40 px-2 py-1 text-xs text-white"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type: e.target.value as MediaType }))
                }
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">URL</label>
            <Input
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
              placeholder="https://..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Thumbnail URL (optional)
              </label>
              <Input
                value={form.thumbnailUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, thumbnailUrl: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Alt text (SEO / accessibility)
              </label>
              <Input
                value={form.alt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, alt: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Section / usage
              </label>
              <Input
                value={form.section}
                onChange={(e) =>
                  setForm((f) => ({ ...f, section: e.target.value }))
                }
                placeholder="hero, services, offers…"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Locale
              </label>
              <select
                className="w-full rounded-lg border border-white/20 bg-black/40 px-2 py-1 text-xs text-white"
                value={form.locale}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    locale: e.target.value as "pl" | "en" | "es",
                  }))
                }
              >
                <option value="pl">PL</option>
                <option value="en">EN</option>
                <option value="es">ES</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Order within section
              </label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">
              Tags (comma separated)
            </label>
            <Textarea
              rows={2}
              value={form.tags}
              onChange={(e) =>
                setForm((f) => ({ ...f, tags: e.target.value }))
              }
              placeholder="hero, dark, movement, background"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              Visible / usable on website
            </label>

            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
              >
                New / Reset
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save media"}
              </Button>
            </div>
          </div>

          {message && (
            <p className="text-xs text-emerald-300 mt-2">{message}</p>
          )}
        </form>
      </Card>

      {/* RIGHT: list */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">
            Existing media assets
          </h2>
          {loading && (
            <span className="text-xs text-white/60 animate-pulse">
              Loading...
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {assets.map((a) => (
            <div
              key={a._id}
              className="flex items-start justify-between gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/80"
            >
              <div
                className="cursor-pointer flex-1"
                onClick={() => editAsset(a)}
              >
                <div className="font-semibold">
                  [{a.type}] {a.title || a.slug}
                  {!a.isActive && (
                    <span className="ml-2 text-[10px] text-red-300">
                      (inactive)
                    </span>
                  )}
                </div>
                <div className="text-white/50 text-[11px]">
                  {a.section || "no section"} · {a.locale?.toUpperCase?.() || ""}
                </div>
              </div>
              <button
                className="text-red-300 hover:text-red-200 text-[11px]"
                onClick={() => handleDelete(a._id)}
              >
                Delete
              </button>
            </div>
          ))}

          {assets.length === 0 && !loading && (
            <p className="text-xs text-white/50">
              No media assets yet – add your first one on the left.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
