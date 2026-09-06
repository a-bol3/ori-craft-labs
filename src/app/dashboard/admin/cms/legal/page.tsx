// src/app/dashboard/admin/cms/legal/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

type LegalFormState = {
  _id?: string;
  slug:
    | "terms-of-service"
    | "privacy-policy"
    | "cookie-policy"
    | "cookie-preferences";
  locale: "pl" | "en" | "es";
  title: string;
  intro: string;
  content: string;
  isActive: boolean;
};

const EMPTY_FORM: LegalFormState = {
  slug: "terms-of-service",
  locale: "pl",
  title: "",
  intro: "",
  content: "",
  isActive: true,
};

const SLUG_LABELS: Record<LegalFormState["slug"], string> = {
  "terms-of-service": "Regulamin świadczenia usług",
  "privacy-policy": "Polityka prywatności",
  "cookie-policy": "Polityka plików cookie",
  "cookie-preferences": "Preferencje plików cookie",
};

export default function CmsLegalPage() {
  const [pages, setPages] = useState<any[]>([]);
  const [form, setForm] = useState<LegalFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadPages() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/legal");
      const data = await res.json();
      setPages(data.pages || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPages();
  }, []);

  function editPage(p: any) {
    setForm({
      _id: p._id,
      slug: p.slug,
      locale: p.locale,
      title: p.title,
      intro: p.intro || "",
      content: p.content || "",
      isActive: p.isActive ?? true,
    });
    setMessage(null);
  }

  function resetForm() {
    setForm(EMPTY_FORM);
    setMessage(null);
  }

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/legal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error saving legal page");
      } else {
        setMessage("Legal page saved ✅");
        await loadPages();
        if (data.page?._id) {
          editPage(data.page);
        }
      }
    } catch (error) {
      console.error(error);
      setMessage("Unexpected error");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this legal version?")) return;
    await fetch(`/api/admin/legal?id=${id}`, { method: "DELETE" });
    if (form._id === id) resetForm();
    await loadPages();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,1.2fr] gap-8">
      <Card className="p-6 bg-black/30 border-white/10">
        <h1 className="text-2xl font-bold mb-4 text-white">Legal pages</h1>
        <p className="text-sm text-white/60 mb-6">
          Text for Terms of Service, Privacy Policy and Cookies. You can keep
          different versions per language.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* slug */}
            <div>
              <label className="block text-xs text-white/60 mb-1">Slug</label>
              <select
                className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-xs text-white"
                value={form.slug}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                  setForm((f) => ({
                    ...f,
                    slug: e.target
                      .value as LegalFormState["slug"],
                  }))
                }
              >
                {(Object.keys(SLUG_LABELS) as LegalFormState["slug"][]).map(
                  (s) => (
                    <option key={s} value={s}>
                      {SLUG_LABELS[s]}
                    </option>
                  )
                )}
              </select>
            </div>

            {/* locale */}
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Locale
              </label>
              <select
                className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-xs text-white"
                value={form.locale}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
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

            {/* active */}
            <div className="flex items-center gap-2 pt-5">
              <label className="flex items-center gap-2 text-xs text-white/70">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setForm((f) => ({ ...f, isActive: e.target.checked }))
                  }
                />
                Active
              </label>
            </div>
          </div>

          {/* title */}
          <div>
            <label className="block text-xs text-white/60 mb-1">Title</label>
            <Input
              value={form.title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setForm((f) => ({ ...f, title: e.target.value }))
              }
            />
          </div>

          {/* intro */}
          <div>
            <label className="block text-xs text-white/60 mb-1">
              Intro / lead paragraph
            </label>
            <Textarea
              rows={2}
              value={form.intro}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm((f) => ({ ...f, intro: e.target.value }))
              }
            />
          </div>

          {/* content */}
          <div>
            <label className="block text-xs text-white/60 mb-1">
              Main content (you can use plain text with headings, etc.)
            </label>
            <Textarea
              rows={14}
              value={form.content}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setForm((f) => ({ ...f, content: e.target.value }))
              }
            />
          </div>

          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              className="border-white/40 text-white/80"
              onClick={resetForm}
            >
              New / Reset
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save legal page"}
            </Button>
          </div>

          {message && (
            <p className="text-xs text-emerald-300 mt-2">{message}</p>
          )}
        </form>
      </Card>

      {/* RIGHT COLUMN: list of versions */}
      <Card className="p-4 bg-black/20 border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">
            Existing versions
          </h2>
          {loading && (
            <span className="text-xs text-white/60 animate-pulse">
              Loading...
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {pages.map((p: any) => (
            <div
              key={p._id}
              className="flex items-start justify-between gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80"
            >
              <div className="cursor-pointer" onClick={() => editPage(p)}>
                <div className="font-semibold">
                  {SLUG_LABELS[p.slug as LegalFormState["slug"]]} ·{" "}
                  {p.locale?.toUpperCase?.() ?? ""}
                  {!p.isActive && (
                    <span className="ml-2 text-[10px] text-red-300">
                      (inactive)
                    </span>
                  )}
                </div>
                <div className="text-white/50 text-[11px]">
                  {p.title} · updated{" "}
                  {p.updatedAt
                    ? new Date(p.updatedAt).toLocaleDateString()
                    : ""}
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
              No legal pages yet – create them on the left.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
