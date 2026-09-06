"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import React, { useEffect, useState } from "react";

type PartnerFormState = {
  _id?: string;
  name: string;
  type: "cafe" | "physio" | "culture-space" | "other";
  locale: "pl" | "en" | "es";
  description: string;
  websiteUrl: string;
  logoUrl: string;
  isActive: boolean;
  order: number;
};

const EMPTY_FORM: PartnerFormState = {
  name: "",
  type: "other",
  locale: "pl",
  description: "",
  websiteUrl: "",
  logoUrl: "",
  isActive: true,
  order: 0,
};

const TYPE_LABELS: Record<PartnerFormState["type"], string> = {
  cafe: "Lokalna kawiarnia",
  physio: "Gabinet fizjoterapii",
  "culture-space": "Przestrzeń kultury",
  other: "Inny partner",
};

export default function CmsPartnersPage() {
  const [partners, setPartners] = useState<any[]>([]);
  const [form, setForm] = useState<PartnerFormState>(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function loadPartners() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/partners");
      const data = await res.json();
      setPartners(data.partners || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadPartners();
  }, []);

  function editPartner(p: any) {
    setForm({
      _id: p._id,
      name: p.name,
      type: p.type,
      locale: p.locale,
      description: p.description || "",
      websiteUrl: p.websiteUrl || "",
      logoUrl: p.logoUrl || "",
      isActive: p.isActive ?? true,
      order: p.order ?? 0,
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
      const res = await fetch("/api/admin/partners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error saving partner");
      } else {
        setMessage("Partner saved ✅");
        await loadPartners();
        if (data.partner?._id) {
          editPartner(data.partner);
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
    if (!confirm("Delete this partner?")) return;
    await fetch(`/api/admin/partners?id=${id}`, { method: "DELETE" });
    if (form._id === id) resetForm();
    await loadPartners();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,1.2fr] gap-8">
      {/* LEFT: form */}
      <div className="p-6 bg-black/30 border border-white/10 rounded-2xl">
        <h1 className="text-2xl font-bold mb-4 text-white">Partners</h1>
        <p className="text-sm text-white/60 mb-6">
          Add and edit your collaborating places: cafes, physio clinics,
          culture spaces. These appear on the public „Partnerzy” page.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">Name</label>
              <input
                className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">Type</label>
              <select
                className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-xs text-white"
                value={form.type}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    type: e.target.value as PartnerFormState["type"],
                  }))
                }
              >
                {(Object.keys(TYPE_LABELS) as PartnerFormState["type"][]).map(
                  (t) => (
                    <option key={t} value={t}>
                      {TYPE_LABELS[t]}
                    </option>
                  )
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">
                Locale
              </label>
              <select
                className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-xs text-white"
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
          </div>

          <div>
            <label className="block text-xs text-white/60 mb-1">
              Description
            </label>
            <textarea
              className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm text-white min-h-20"
              value={form.description}
              onChange={(e) =>
                setForm((f) => ({ ...f, description: e.target.value }))
              }
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Website URL
              </label>
              <input
                className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                value={form.websiteUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, websiteUrl: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs text-white/60 mb-1">
                Logo URL (optional)
              </label>
              <input
                className="w-full rounded-md bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                value={form.logoUrl}
                onChange={(e) =>
                  setForm((f) => ({ ...f, logoUrl: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              Visible on website
            </label>

            <div className="flex items-center gap-2 text-xs text-white/60">
              Order:
              <input
                type="number"
                className="w-20 rounded-md bg-black/40 border border-white/20 px-2 py-1 text-xs text-white"
                value={form.order}
                onChange={(e) =>
                  setForm((f) => ({ ...f, order: Number(e.target.value) }))
                }
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 rounded-full border border-white/40 text-white/80 text-xs uppercase tracking-wide"
            >
              New / Reset
            </button>

            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-full bg-cta text-brand text-xs font-semibold uppercase tracking-wide hover:bg-[#ffc666] disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save partner"}
            </button>
          </div>

          {message && (
            <p className="text-xs text-emerald-300 mt-2">{message}</p>
          )}
        </form>
      </div>

      {/* RIGHT: list of partners */}
      <div className="p-4 bg-black/20 border border-white/10 rounded-2xl">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Existing partners</h2>
          {loading && (
            <span className="text-xs text-white/60 animate-pulse">
              Loading...
            </span>
          )}
        </div>

        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {partners.map((p) => (
            <div
              key={p._id}
              className="flex items-start justify-between gap-2 rounded-md border border-white/10 bg-black/30 px-3 py-2 text-xs text-white/80"
            >
              <div className="cursor-pointer" onClick={() => editPartner(p)}>
                <div className="font-semibold">
                  {TYPE_LABELS[p.type as PartnerFormState["type"]]} · {p.name}
                  {!p.isActive && (
                    <span className="ml-2 text-[10px] text-red-300">
                      (hidden)
                    </span>
                  )}
                </div>
                <div className="text-white/50 text-[11px]">
                  {p.websiteUrl || "no website"}
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

          {partners.length === 0 && !loading && (
            <p className="text-xs text-white/50">
              No partners yet – add your first one on the left.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
