// src/components/admin/HeroEditor.tsx
"use client";

import { useState } from "react";

export type HeroConfig = {
  locale: "pl" | "en" | "es";
  titleLine1: string;
  titleLine2: string;
  subtitle: string;
  primaryCtaLabel: string;
  primaryCtaHref: string;
  secondaryCtaLabel: string;
  secondaryCtaHref: string;
};

export function HeroEditor({ initialHero }: { initialHero: HeroConfig }) {
  const [hero, setHero] = useState<HeroConfig>(initialHero);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    "idle"
  );
  const [message, setMessage] = useState("");

  function updateField(field: keyof HeroConfig, value: string) {
    setHero((prev) => ({ ...prev, [field]: value } as HeroConfig));
    setStatus("idle");
    setMessage("");
  }

  async function handleSave() {
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch("/api/admin/cms/hero", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(hero),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error updating hero");
      }

      setStatus("saved");
      setMessage("Changes saved successfully.");
    } catch (err: any) {
      console.error("HERO_SAVE_ERROR:", err);
      setStatus("error");
      setMessage(err.message || "Something went wrong.");
    }
  }

  function handleRestoreDefault() {
    // Restore to original initialHero provided by server
    setHero(initialHero);
    setStatus("idle");
    setMessage("Restored to the loaded version. Click Save to apply.");
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl shadow-black/60 space-y-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-heading font-semibold mb-1">
            Hero & Banner – Home Page
          </h3>
          <p className="text-xs text-white/70 font-body">
            Edit the main headline, subtitle and CTAs visible on the landing
            hero section.
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={handleSave}
            disabled={status === "saving"}
            className="px-5 py-2 bg-cta text-black rounded-full text-xs font-heading font-semibold uppercase tracking-widest shadow-md shadow-cta/30 hover:bg-cta/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "saving" ? "Saving..." : "Save changes"}
          </button>
          <button
            type="button"
            onClick={handleRestoreDefault}
            className="px-4 py-1 text-xs rounded-full border border-white/20 text-white/70 hover:border-cta hover:text-cta transition-colors font-body"
          >
            Restore loaded version
          </button>
          {message && (
            <p
              className={`text-xs font-body ${
                status === "error" ? "text-red-400" : "text-emerald-400"
              }`}
            >
              {message}
            </p>
          )}
        </div>
      </div>

      {/* Fields */}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Title line 1
          </label>
          <input
            type="text"
            value={hero.titleLine1}
            onChange={(e) => updateField("titleLine1", e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          />
        </div>
        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Title line 2
          </label>
          <input
            type="text"
            value={hero.titleLine2}
            onChange={(e) => updateField("titleLine2", e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
          Subtitle
        </label>
        <textarea
          value={hero.subtitle}
          onChange={(e) => updateField("subtitle", e.target.value)}
          className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          rows={3}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Primary CTA label
          </label>
          <input
            type="text"
            value={hero.primaryCtaLabel}
            onChange={(e) => updateField("primaryCtaLabel", e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          />
        </div>
        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Primary CTA link (href)
          </label>
          <input
            type="text"
            value={hero.primaryCtaHref}
            onChange={(e) => updateField("primaryCtaHref", e.target.value)}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
            placeholder="#oferta"
          />
        </div>
        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Secondary CTA label
          </label>
          <input
            type="text"
            value={hero.secondaryCtaLabel}
            onChange={(e) =>
              updateField("secondaryCtaLabel", e.target.value)
            }
            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          />
        </div>
        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Secondary CTA link (href)
          </label>
          <input
            type="text"
            value={hero.secondaryCtaHref}
            onChange={(e) =>
              updateField("secondaryCtaHref", e.target.value)
            }
            className="w-full bg-black/30 border border-white/20 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
            placeholder="#oferta"
          />
        </div>
      </div>
    </div>
  );
}
