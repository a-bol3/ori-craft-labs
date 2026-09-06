// src/components/admin/ServicesManager.tsx
"use client";

import { useState } from "react";

export type ServiceSection =
  | "wellbeing-movement"
  | "culture-in-motion"
  | "flavors-kitchen"
  | "education-schools"
  | "corporate-organizations"
  | "community-private";

export type ServiceDTO = {
  id?: string;
  locale: "pl" | "en" | "es";
  section: ServiceSection;
  title: string;
  subtitle: string;
  slug: string;
  shortDescription: string;
  valueSummary: string;
  priceFrom: string;
  duration: string;
  bullets: string[]; // we’ll edit as textarea with one per line
  isActive: boolean;
};

const SECTION_LABELS: Record<ServiceSection, string> = {
  "wellbeing-movement": "Wellbeing & Movement",
  "culture-in-motion": "Culture in motion",
  "flavors-kitchen": "Flavors & Kitchen",
  "education-schools": "Education & Schools",
  "corporate-organizations": "Corporate & Organizations",
  "community-private": "Community & Private",
};

function emptyService(): ServiceDTO {
  return {
    id: undefined,
    locale: "pl",
    section: "wellbeing-movement",
    title: "",
    subtitle: "",
    slug: "",
    shortDescription: "",
    valueSummary: "",
    priceFrom: "",
    duration: "",
    bullets: [],
    isActive: true,
  };
}

export function ServicesManager({ initialServices }: { initialServices: ServiceDTO[] }) {
  const [services, setServices] = useState<ServiceDTO[]>(initialServices);
  const [current, setCurrent] = useState<ServiceDTO>(emptyService());
  const [status, setStatus] = useState<"idle" | "saving" | "deleting" | "error" | "saved">(
    "idle"
  );
  const [message, setMessage] = useState<string>("");

  function selectForEdit(service: ServiceDTO) {
    setCurrent({ ...service });
    setStatus("idle");
    setMessage("");
  }

  function handleNew() {
    setCurrent(emptyService());
    setStatus("idle");
    setMessage("");
  }

  function updateField<K extends keyof ServiceDTO>(key: K, value: ServiceDTO[K]) {
    setCurrent((prev) => ({ ...prev, [key]: value }));
    setStatus("idle");
    setMessage("");
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setStatus("saving");
    setMessage("");

    try {
      const payload: any = {
        ...current,
        bullets:
          typeof current.bullets === "string"
            ? (current.bullets as any).split("\n").map((b: string) => b.trim()).filter(Boolean)
            : current.bullets,
      };

      const isNew = !current.id;

      const res = await fetch("/api/admin/cms/services", {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error saving service");
      }

      const saved: ServiceDTO = data.service;

      setServices((prev) => {
        if (isNew) return [saved, ...prev];
        return prev.map((s) => (s.id === saved.id ? saved : s));
      });

      setCurrent(saved);
      setStatus("saved");
      setMessage("Service saved.");
    } catch (err: any) {
      console.error("SERVICE_SAVE_ERROR", err);
      setStatus("error");
      setMessage(err.message || "Something went wrong while saving.");
    }
  }

  async function handleDelete() {
    if (!current.id) return;
    if (!confirm("Delete this service?")) return;

    setStatus("deleting");
    setMessage("");

    try {
      const res = await fetch("/api/admin/cms/services", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: current.id }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error deleting service");
      }

      setServices((prev) => prev.filter((s) => s.id !== current.id));
      setCurrent(emptyService());
      setStatus("idle");
      setMessage("Service deleted.");
    } catch (err: any) {
      console.error("SERVICE_DELETE_ERROR", err);
      setStatus("error");
      setMessage(err.message || "Something went wrong while deleting.");
    }
  }

  const bulletsText = (current.bullets || []).join("\n");

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr),minmax(0,3fr)]">
      {/* LEFT: list of services */}
      <div className="rounded-3xl border border-white/10 bg-black/40 p-5 shadow-xl shadow-black/60">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-heading uppercase tracking-widest text-white/70">
            Services list (PL)
          </h3>
          <button
            type="button"
            onClick={handleNew}
            className="px-3 py-1.5 rounded-full bg-cta text-black text-xs font-heading uppercase tracking-widest hover:bg-cta/90 transition-colors"
          >
            New service
          </button>
        </div>
        {services.length === 0 ? (
          <p className="text-sm text-white/60 font-body">
            No services yet. Click <strong>New service</strong> to create one.
          </p>
        ) : (
          <ul className="divide-y divide-white/10">
            {services.map((s) => (
              <li
                key={s.id}
                className="py-3 flex items-start gap-3 cursor-pointer hover:bg-white/5 px-2 rounded-xl"
                onClick={() => selectForEdit(s)}
              >
                <div className="mt-1 h-2 w-2 rounded-full bg-cta" />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-heading text-white/90">
                      {s.title}
                    </p>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-white/70 font-heading uppercase tracking-widest">
                      {SECTION_LABELS[s.section]}
                    </span>
                    {!s.isActive && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-heading uppercase tracking-widest">
                        Hidden
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-white/60 font-body line-clamp-2">
                    {s.shortDescription}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT: editor */}
      <form
        onSubmit={handleSave}
        className="rounded-3xl border border-white/10 bg-black/40 p-6 shadow-xl shadow-black/60 space-y-4"
      >
        <div className="flex items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-heading font-semibold mb-1">
              {current.id ? "Edit service" : "New service"}
            </h3>
            <p className="text-xs text-white/70 font-body">
              Services power the cards on the Services page and landing
              sections. Start with PL, we’ll add EN/ES later.
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2">
              {current.id && (
                <button
                  type="button"
                  onClick={handleDelete}
                  disabled={status === "deleting" || status === "saving"}
                  className="px-4 py-1.5 rounded-full border border-red-500/60 text-red-300 text-xs font-heading uppercase tracking-widest hover:bg-red-500/10 transition-colors disabled:opacity-60"
                >
                  {status === "deleting" ? "Deleting..." : "Delete"}
                </button>
              )}
              <button
                type="submit"
                disabled={status === "saving" || status === "deleting"}
                className="px-5 py-2 rounded-full bg-cta text-black text-xs font-heading uppercase tracking-widest hover:bg-cta/90 transition-colors disabled:opacity-60"
              >
                {status === "saving" ? "Saving..." : "Save"}
              </button>
            </div>
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

        {/* Main fields */}
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Section
            </label>
            <select
              value={current.section}
              onChange={(e) =>
                updateField("section", e.target.value as ServiceSection)
              }
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
            >
              {(
                Object.keys(SECTION_LABELS) as ServiceSection[]
              ).map((key) => (
                <option key={key} value={key}>
                  {SECTION_LABELS[key]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Slug (internal)
            </label>
            <input
              type="text"
              value={current.slug}
              onChange={(e) => updateField("slug", e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
              placeholder="movement-flow"
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Title
            </label>
            <input
              type="text"
              value={current.title}
              onChange={(e) => updateField("title", e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
              placeholder="Movement & Flow"
            />
          </div>
          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Subtitle
            </label>
            <input
              type="text"
              value={current.subtitle}
              onChange={(e) => updateField("subtitle", e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
              placeholder="Taniec, oddech i świadomość ciała"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Short description (card)
          </label>
          <textarea
            value={current.shortDescription}
            onChange={(e) =>
              updateField("shortDescription", e.target.value)
            }
            rows={2}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          />
        </div>

        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Value summary (benefits)
          </label>
          <textarea
            value={current.valueSummary}
            onChange={(e) => updateField("valueSummary", e.target.value)}
            rows={3}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Price from (optional)
            </label>
            <input
              type="text"
              value={current.priceFrom}
              onChange={(e) => updateField("priceFrom", e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
              placeholder="od 1000 zł"
            />
          </div>
          <div>
            <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
              Duration (optional)
            </label>
            <input
              type="text"
              value={current.duration}
              onChange={(e) => updateField("duration", e.target.value)}
              className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
              placeholder="60–90 min"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Bullet points (one per line)
          </label>
          <textarea
            value={bulletsText}
            onChange={(e) =>
              updateField(
                "bullets",
                e.target.value.split("\n").map((b) => b.trim())
              )
            }
            rows={4}
            className="w-full bg-black/30 border border-white/20 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          />
        </div>

        <div className="flex items-center gap-2">
          <input
            id="isActive"
            type="checkbox"
            checked={current.isActive}
            onChange={(e) => updateField("isActive", e.target.checked)}
            className="h-4 w-4 rounded border-white/30 bg-black/40"
          />
          <label
            htmlFor="isActive"
            className="text-xs text-white/70 font-body"
          >
            Show this service on the website
          </label>
        </div>
      </form>
    </div>
  );
}
