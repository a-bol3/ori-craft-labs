// src/app/dashboard/admin/users/page.tsx
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";
import { CreateUserForm } from "@/components/admin/CreateUserForm";
import { UsersTable } from "@/components/admin/UsersTable";

export default async function AdminUsersPage() {
  await dbConnect();

  const rawUsers = await User.find().sort({ createdAt: -1 }).lean();

  const users = rawUsers.map((u: any) => ({
    id: u._id.toString(),
    name: u.name ?? "",
    email: u.email,
    role: u.role,
    preferredLocale: u.preferredLocale ?? "pl",
    createdAt: u.createdAt ? u.createdAt.toISOString() : "",
  }));

  return (
    <section className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-heading font-bold mb-2">Users</h2>
        <p className="text-white/70 font-body">
          View all users and create new accounts for your team, partners or
          clients.
        </p>
      </div>

      {/* Create user form */}
      <CreateUserForm />

      {/* Users table */}
      <div className="rounded-3xl border border-white/10 bg-black/30 p-4 md:p-6 shadow-xl shadow-black/50 overflow-x-auto">
        <h3 className="text-lg font-heading font-semibold mb-4">
          Existing users
        </h3>
        <UsersTable initialUsers={users} />
      </div>
    </section>
  );
}
