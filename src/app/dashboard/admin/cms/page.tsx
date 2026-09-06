// src/app/dashboard/admin/cms/page.tsx
import { redirect } from "next/navigation";

export default function CmsIndexPage() {
  // Default: go to Hero editor
  redirect("/dashboard/admin/cms/hero");
}
