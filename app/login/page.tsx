"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login } from "@/lib/storage";

export default function LoginPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    login({ name: name || email.split("@")[0], email });
    router.push("/");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-base px-6">
      <div className="w-full max-w-sm">
        <div className="mb-10 flex items-center gap-3">
          <span className="relative flex h-3 w-3">
            <span className="absolute inline-flex h-full w-full rounded-full bg-pulse animate-pulse-ring" />
            <span className="relative inline-flex h-3 w-3 rounded-full bg-pulse" />
          </span>
          <span className="font-head text-2xl font-semibold text-ink">Ritmo</span>
        </div>

        <h1 className="font-head text-xl font-semibold text-ink mb-1">
          Entrar
        </h1>
        <p className="text-ink-muted text-sm mb-8">
          Sua rotina, sem precisar agendar nada na mão.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-ink-muted mb-1.5" htmlFor="name">
              Nome
            </label>
            <input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Como podemos te chamar"
              className="w-full rounded-card bg-base-raised border border-line px-4 py-3 text-ink placeholder:text-ink-faint outline-none focus:border-pulse transition-colors"
            />
          </div>

          <div>
            <label className="block text-sm text-ink-muted mb-1.5" htmlFor="email">
              E-mail
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
              className="w-full rounded-card bg-base-raised border border-line px-4 py-3 text-ink placeholder:text-ink-faint outline-none focus:border-pulse transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-card bg-pulse text-base font-semibold py-3 mt-2 hover:bg-pulse-strong transition-colors"
          >
            Entrar
          </button>
        </form>

        <p className="text-ink-faint text-xs mt-6">
          Login simplificado por enquanto — autenticação real entra quando o
          backend for definido.
        </p>
      </div>
    </div>
  );
}
