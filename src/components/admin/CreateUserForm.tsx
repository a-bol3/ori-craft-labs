// src/components/admin/CreateUserForm.tsx
"use client";

import { FormEvent, useState } from "react";

export function CreateUserForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "client" | "partner" | "affiliate" | "employee">("client");
  const [preferredLocale, setPreferredLocale] = useState<"pl" | "en" | "es">("pl");

  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
          preferredLocale,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Something went wrong");
      }

      setStatus("success");
      setMessage("User created successfully.");

      // Clear fields
      setName("");
      setEmail("");
      setPassword("");

      // Simple way: refresh the page so the new user appears in the list
      window.location.reload();
    } catch (err) {
      console.error("CREATE_USER_ERROR:", err);
      setStatus("error");
      setMessage("Could not create user. Please check data and try again.");
    } finally {
      setStatus((prev) => (prev === "loading" ? "idle" : prev));
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-black/30 p-6 shadow-xl shadow-black/50">
      <h3 className="text-lg font-heading font-semibold mb-3">
        Create new user
      </h3>
      <p className="text-sm text-white/70 font-body mb-4">
        This is for internal use. Later we can limit which admins can do this.
      </p>

      <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
        <div className="md:col-span-2">
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Name
          </label>
          <input
            type="text"
            value={name}
            required
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
            placeholder="Full name"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Email
          </label>
          <input
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
            placeholder="email@example.com"
          />
        </div>

        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
            placeholder="Temporary password"
          />
        </div>

        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Role
          </label>
          <select
            value={role}
            onChange={(e) =>
              setRole(e.target.value as any)
            }
            className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          >
            <option value="admin">Admin</option>
            <option value="client">Client</option>
            <option value="partner">Partner</option>
            <option value="affiliate">Affiliate</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-heading uppercase tracking-widest text-white/70 mb-1">
            Preferred language
          </label>
          <select
            value={preferredLocale}
            onChange={(e) =>
              setPreferredLocale(e.target.value as any)
            }
            className="w-full bg-black/20 border border-white/15 rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta font-body"
          >
            <option value="pl">Polish</option>
            <option value="en">English</option>
            <option value="es">Spanish</option>
          </select>
        </div>

        <div className="md:col-span-2 flex items-center justify-between gap-4">
          <button
            type="submit"
            disabled={status === "loading"}
            className="px-5 py-2.5 bg-cta text-black rounded-full text-sm font-heading font-semibold uppercase tracking-widest shadow-md shadow-cta/30 hover:bg-cta/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Creating..." : "Create user"}
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
      </form>
    </div>
  );
}
