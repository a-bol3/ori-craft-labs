// src/app/api/admin/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import { User } from "@/lib/models/User";

function json(
  data: any,
  init?: { status?: number }
): NextResponse {
  return NextResponse.json(data, { status: init?.status ?? 200 });
}

// PATCH /api/admin/users/:id  → change role
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const { role } = body;

  const allowedRoles = [
    "admin",
    "client",
    "partner",
    "affiliate",
    "employee",
  ];

  if (!allowedRoles.includes(role)) {
    return json({ success: false, error: "Invalid role" }, { status: 400 });
  }

  await dbConnect();

  await User.findByIdAndUpdate(id, { role });

  return json({ success: true });
}

// DELETE /api/admin/users/:id  → delete user
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "admin") {
    return json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  await dbConnect();

  const currentUserId = (session.user as any).id;

  // tiny safety: don't let admin delete themselves
  if (currentUserId && currentUserId === id) {
    return json(
      { success: false, error: "You cannot delete your own account." },
      { status: 400 }
    );
  }

  await User.findByIdAndDelete(id);

  return json({ success: true });
}
