// src/components/admin/UsersTable.tsx
"use client";

import { useState } from "react";

type SafeUser = {
  id: string;
  name: string;
  email: string;
  role: string;
  preferredLocale: string;
  createdAt: string;
};

function formatDate(date: string | null) {
  if (!date) return "-";
  return date.slice(0, 10); // YYYY-MM-DD
}

export function UsersTable({ initialUsers }: { initialUsers: SafeUser[] }) {
  const [users, setUsers] = useState<SafeUser[]>(initialUsers);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const roles = ["admin", "client", "partner", "affiliate", "employee"];

  async function changeRole(id: string, newRole: string) {
    setLoadingId(id + "-role");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error changing role");
      }

      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      console.error("CHANGE_ROLE_ERROR:", err);
      alert("Could not change role. Check console for details.");
    } finally {
      setLoadingId(null);
    }
  }

  async function deleteUser(id: string) {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }

    setLoadingId(id + "-delete");
    try {
      const res = await fetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Error deleting user");
      }

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("DELETE_USER_ERROR:", err);
      alert("Could not delete user. Check console for details.");
    } finally {
      setLoadingId(null);
    }
  }

  if (users.length === 0) {
    return (
      <p className="text-sm text-white/70 font-body">
        No users found yet. Use the form above to create the first one.
      </p>
    );
  }

  return (
    <table className="min-w-full text-sm font-body">
      <thead>
        <tr className="text-left text-xs uppercase tracking-widest text-white/60 border-b border-white/10">
          <th className="py-2 pr-4">Name</th>
          <th className="py-2 pr-4">Email</th>
          <th className="py-2 pr-4">Role</th>
          <th className="py-2 pr-4">Language</th>
          <th className="py-2 pr-4">Created</th>
          <th className="py-2 pr-4 text-right">Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr
            key={u.id}
            className="border-b border-white/5 last:border-b-0 hover:bg-white/5"
          >
            <td className="py-2 pr-4">
              <span className="font-medium text-white">{u.name || "-"}</span>
            </td>
            <td className="py-2 pr-4">
              <span className="text-white/80">{u.email}</span>
            </td>
            <td className="py-2 pr-4">
              <div className="inline-flex items-center gap-2">
                <RoleBadge role={u.role} />
                <select
                  value={u.role}
                  disabled={loadingId === u.id + "-role"}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  className="bg-black/30 border border-white/15 rounded-full px-3 py-1 text-xs text-white focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta"
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </div>
            </td>
            <td className="py-2 pr-4 uppercase text-white/70">
              {u.preferredLocale || "pl"}
            </td>
            <td className="py-2 pr-4 text-white/60">
              {formatDate(u.createdAt)}
            </td>
            <td className="py-2 pr-4 text-right">
              <button
                type="button"
                onClick={() => deleteUser(u.id)}
                disabled={loadingId === u.id + "-delete"}
                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-red-500/80 text-black hover:bg-red-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Delete
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function RoleBadge({ role }: { role: string }) {
  const map: Record<string, { label: string; className: string }> = {
    admin: {
      label: "Admin",
      className: "bg-cta text-black",
    },
    client: {
      label: "Client",
      className: "bg-brand-accent1/40 text-white",
    },
    partner: {
      label: "Partner",
      className: "bg-brand-secondary/40 text-white",
    },
    affiliate: {
      label: "Affiliate",
      className: "bg-brand-accent2/40 text-white",
    },
    employee: {
      label: "Employee",
      className: "bg-brand-accent4/40 text-white",
    },
  };

  const cfg =
    map[role] || ({ label: role, className: "bg-white/10 text-white" } as const);

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}
