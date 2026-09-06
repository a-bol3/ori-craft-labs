// src/app/cookie-preferences/page.tsx
import CommonVideoHeader from "@/components/ui/common-video-header";
import { getLegalPage } from "@/lib/legal";

export const dynamic = "force-dynamic";

export const revalidate = 300;

export default async function CookiePreferencesPage() {
  const page = await getLegalPage("cookie-preferences", "pl");

  return (
    <main className="min-h-screen bg-brand pt-24 pb-16 relative overflow-hidden">
      <CommonVideoHeader />
      <div className="container mx-auto px-6 md:px-8 relative z-10 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-black text-cta mb-8 uppercase font-display tracking-tight">
          {page?.title || "Preferencje plików cookie"}
        </h1>
        {page?.intro && (
          <p className="text-white/70 mb-6 whitespace-pre-line">
            {page.intro}
          </p>
        )}
        <div className="prose prose-invert max-w-none text-white/80 whitespace-pre-line">
          {page?.content || "Zarządzanie preferencjami ciasteczek w przygotowaniu."}
        </div>
      </div>
    </main>
  );
}
