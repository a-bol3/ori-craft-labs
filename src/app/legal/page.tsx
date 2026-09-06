import React from "react";

export default function LegalPage() {
    return (
        <main className="min-h-screen bg-brand text-white pt-32 pb-16">
            <div className="container mx-auto px-8 max-w-4xl relative z-10">
                <h1 className="text-4xl md:text-5xl font-black mb-8 font-heading uppercase">Prawne</h1>
                <div className="bg-white/5 border border-white/10 p-8 rounded-2xl backdrop-blur-sm prose prose-invert max-w-none">
                    <p>Informacje prawne...</p>
                </div>
            </div>
        </main>
    );
}
