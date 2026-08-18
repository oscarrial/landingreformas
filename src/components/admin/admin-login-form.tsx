"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { siteConfig } from "@/config/site";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "No se pudo iniciar sesión.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Error de conexión.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={submit}
      className="mx-auto mt-16 max-w-sm rounded-sm border border-line bg-paper p-8"
    >
      <h1 className="font-display text-2xl text-ink">
        Acceso administrador
      </h1>
      <p className="mt-1 text-sm text-ink-soft">{siteConfig.brandName}</p>

      <label htmlFor="password" className="mt-6 block text-sm font-medium text-ink">
        Contraseña
      </label>
      <input
        id="password"
        name="password"
        type="password"
        autoComplete="current-password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        className="mt-2 w-full rounded-sm border border-line bg-white px-4 py-3 text-ink focus:border-bronze-deep focus:outline-none"
      />

      {error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="mt-6 w-full rounded-sm bg-ink px-4 py-3 text-base font-semibold text-paper transition-colors hover:bg-ink-soft disabled:opacity-60"
      >
        {busy ? "Comprobando…" : "Entrar"}
      </button>
    </form>
  );
}
