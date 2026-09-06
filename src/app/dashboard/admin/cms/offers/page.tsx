// src/app/dashboard/admin/cms/offers/page.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import { OfferGroup } from "@/lib/models/Offer"; // TS type only
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";

type OfferFormState = {
  _id?: string;
  group: OfferGroup;
  slug: string;
  locale: "pl" | "en" | "es";
  title: string;
  subtitle: string;
  priceFrom: string;
  duration: string;
  includes: string; // textarea (one per line)
  value: string;
  idealFor: string;
  notes: string;
  order: number;
  isActive: boolean;
};

const EMPTY_FORM: OfferFormState = {
  group: "children-youth",
  slug: "",
  locale: "pl",
  title: "",
  subtitle: "",
  priceFrom: "",
  duration: "",
  includes: "",
  value: "",
  idealFor: "",
  notes: "",
  order: 0,
  isActive: true,
};

const GROUP_LABELS: Record<OfferGroup, string> = {
  "children-youth": "Children & Youth",
  adults: "Adults – Move & Relax",
  corporate: "Corporate / Firmy i instytucje",
  "cooking-tasting": "Cooking & Tasting",
  "culture-evening": "Culture Evening",
  "team-offsite": "Team Offsite package",
  retreats: "Weekend retreats",
};

export default function CmsOffersPage() {
  const [offers, setOffers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<OfferFormState>(EMPTY_FORM);
  const [message, setMessage] = useState<string | null>(null);

  async function loadOffers() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/offers");
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOffers();
  }, []);

  function editOffer(o: any) {
    setForm({
      _id: o._id,
      group: o.group,
      slug: o.slug,
      locale: o.locale,
      title: o.title,
      subtitle: o.subtitle || "",
      priceFrom: o.priceFrom || "",
      duration: o.duration || "",
      includes: (o.includes || []).join("\n"),
      value: o.value || "",
      idealFor: o.idealFor || "",
      notes: o.notes || "",
      order: o.order ?? 0,
      isActive: o.isActive ?? true,
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
      const res = await fetch("/api/admin/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          includes: form.includes
            .split("\n")
            .map((l) => l.trim())
            .filter(Boolean),
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Error saving offer");
      } else {
        setMessage("Offer saved ✅");
        await loadOffers();
        if (data.offer?._id) {
          editOffer(data.offer);
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
    if (!confirm("Delete this offer?")) return;
    await fetch(`/api/admin/offers?id=${id}`, { method: "DELETE" });
    if (form._id === id) resetForm();
    await loadOffers();
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1.8fr,1.2fr] gap-8">
      {/* LEFT: form */}
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-4 text-white">
          Offers &amp; Packages
        </h1>
        <p className="text-sm text-white/60 mb-6">
          Everything you see on the public <strong>Oferta</strong> page comes
          from here. Choose the group (Children, Adults, Corporate…), then
          describe the offer.
        </p>

        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Group */}
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Group (section)
              </label>
              <select
                className="w-full rounded-lg border border-white/20 bg-black/40 px-2 py-1 text-xs text-white"
                value={form.group}
                onChange={(e) =>
                  setForm((f) => ({ ...f, group: e.target.value as OfferGroup }))
                }
              >
                {(
                  Object.keys(GROUP_LABELS) as (keyof typeof GROUP_LABELS)[]
                ).map((g) => (
                  <option key={g} value={g}>
                    {GROUP_LABELS[g]}
                  </option>
                ))}
              </select>
            </div>

            {/* Slug */}
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Slug (internal)
              </label>
              <Input
                value={form.slug}
                onChange={(e) =>
                  setForm((f) => ({ ...f, slug: e.target.value }))
                }
                placeholder="children-rhythm-lab-single"
              />
            </div>

            {/* Locale */}
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
          </div>

          {/* Title / subtitle */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">Title</label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm((f) => ({ ...f, title: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Subtitle / label
              </label>
              <Input
                value={form.subtitle}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subtitle: e.target.value }))
                }
              />
            </div>
          </div>

          {/* Price / duration / order */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Price (e.g. &quot;od 1000 zł&quot;)
              </label>
              <Input
                value={form.priceFrom}
                onChange={(e) =>
                  setForm((f) => ({ ...f, priceFrom: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Duration (e.g. &quot;60–90 min&quot;)
              </label>
              <Input
                value={form.duration}
                onChange={(e) =>
                  setForm((f) => ({ ...f, duration: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-1">
                Order (within group)
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

          {/* Includes */}
          <div>
            <label className="block text-xs text-white/60 mb-1">
              Includes (one bullet per line)
            </label>
            <Textarea
              rows={4}
              value={form.includes}
              onChange={(e) =>
                setForm((f) => ({ ...f, includes: e.target.value }))
              }
            />
          </div>

          {/* Value */}
          <div>
            <label className="block text-xs text-white/60 mb-1">
              Value (Wartość)
            </label>
            <Textarea
              rows={3}
              value={form.value}
              onChange={(e) =>
                setForm((f) => ({ ...f, value: e.target.value }))
              }
            />
          </div>

          {/* Ideal for */}
          <div>
            <label className="block text-xs text-white/60 mb-1">
              Idealne dla
            </label>
            <Textarea
              rows={2}
              value={form.idealFor}
              onChange={(e) =>
                setForm((f) => ({ ...f, idealFor: e.target.value }))
              }
            />
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs text-white/60 mb-1">
              Extra notes (e.g. travel costs)
            </label>
            <Textarea
              rows={2}
              value={form.notes}
              onChange={(e) =>
                setForm((f) => ({ ...f, notes: e.target.value }))
              }
            />
          </div>

          {/* Flags + buttons */}
          <div className="flex items-center gap-4 justify-between pt-2">
            <label className="flex items-center gap-2 text-xs text-white/70">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              Show this offer on the website
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
                {saving ? "Saving..." : "Save offer"}
              </Button>
            </div>
          </div>

          {message && (
            <p className="text-xs mt-2 text-emerald-300">{message}</p>
          )}
        </form>
      </Card>

      {/* RIGHT: list of offers */}
      <Card className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold text-white">Existing offers</h2>
          {loading && (
            <span className="text-xs text-white/60 animate-pulse">
              Loading...
            </span>
          )}
        </div>
        <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
          {offers.map((o) => (
            <div
              key={o._id}
              className="flex items-start justify-between gap-2 rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs text-white/80"
            >
              <div className="cursor-pointer" onClick={() => editOffer(o)}>
                <div className="font-semibold">
                  {GROUP_LABELS[o.group as OfferGroup]} · {o.title}
                  {!o.isActive && (
                    <span className="ml-2 text-[10px] text-red-300">
                      (hidden)
                    </span>
                  )}
                </div>
                <div className="text-white/50">
                  {o.priceFrom} · {o.duration}
                </div>
              </div>
              <button
                className="text-red-300 hover:text-red-200 text-[11px]"
                onClick={() => handleDelete(o._id)}
              >
                Delete
              </button>
            </div>
          ))}
          {offers.length === 0 && !loading && (
            <p className="text-xs text-white/50">
              No offers yet – add your first one on the left.
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
