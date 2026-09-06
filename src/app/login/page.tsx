// src/app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setStatus("error");
      setMessage("Nieprawidłowy email lub hasło.");
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-brand">
      <div className="w-full max-w-md bg-black/40 border border-white/10 rounded-3xl p-8 shadow-2xl shadow-black/60">
        <h1 className="text-2xl font-bold text-white mb-6 text-center font-heading">
          Zaloguj się
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white mb-2 uppercase tracking-wide font-heading"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta transition-colors font-body"
              placeholder="Twój email"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2 uppercase tracking-wide font-heading"
            >
              Hasło
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/40 focus:outline-none focus:border-cta focus:ring-1 focus:ring-cta transition-colors font-body"
              placeholder="Twoje hasło"
              required
            />
          </div>

          {status === "error" && (
            <p className="text-sm text-red-400 font-body">{message}</p>
          )}

          <button
            type="submit"
            disabled={status === "loading"}
            className="w-full py-3 bg-cta text-black rounded-full font-bold uppercase tracking-widest text-lg font-heading shadow-lg shadow-cta/20 hover:bg-cta/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {status === "loading" ? "Logowanie..." : "Zaloguj się"}
          </button>
        </form>
      </div>
    </main>
  );
}
