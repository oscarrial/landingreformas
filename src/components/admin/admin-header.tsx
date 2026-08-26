"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { siteConfig } from "@/config/site";

export function AdminHeader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const logout = async () => {
    setBusy(true);
    try {
      await fetch("/api/admin/logout", { method: "POST" });
      router.push("/admin/login");
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <header className="border-b border-line bg-paper">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <nav className="flex items-center gap-5 text-sm">
          <Link href="/admin" className="font-display text-lg text-ink">
            {siteConfig.brandName} <span className="text-bronze-deep">· admin</span>
          </Link>
          <Link href="/admin/leads" className="link-ghost text-ink-soft">
            Leads
          </Link>
          <Link href="/admin/posts" className="link-ghost text-ink-soft">
            Blog
          </Link>
          <Link href="/" className="link-ghost text-ink-soft">
            Ver web
          </Link>
        </nav>
        <button
          type="button"
          onClick={logout}
          disabled={busy}
          className="rounded-sm border border-line px-3 py-1.5 text-sm font-semibold text-ink-soft transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
        >
          {busy ? "Saliendo…" : "Salir"}
        </button>
      </div>
    </header>
  );
}
