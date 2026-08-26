"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeletePostButton({ postId }: { postId: number }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    if (!window.confirm("¿Eliminar esta entrada? No se puede deshacer.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        window.alert(data.error ?? "No se pudo eliminar.");
        return;
      }
      router.refresh();
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={remove}
      disabled={busy}
      className="rounded-sm border border-red-200 px-3 py-1.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50 disabled:opacity-50"
    >
      {busy ? "Eliminando…" : "Eliminar"}
    </button>
  );
}