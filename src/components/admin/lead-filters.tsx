"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { LEAD_STATUSES, LEAD_STATUS_LABELS } from "@/lib/db/types";

/**
 * Server-driven filters: submits to the same page with query params.
 * (Keeps the admin list fast; no client data fetching.)
 */
export function LeadFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [status, setStatus] = useState(searchParams.get("status") ?? "");
  const [source, setSource] = useState(searchParams.get("source") ?? "");

  const apply = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (status) params.set("status", status);
    if (source.trim()) params.set("source", source.trim());
    params.set("page", "1");
    router.push(`/admin/leads?${params.toString()}`);
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        apply();
      }}
      className="mt-6 flex flex-wrap items-end gap-3"
    >
      <div>
        <label htmlFor="lead-search" className="block text-xs font-medium uppercase tracking-wide text-ink-soft">
          Buscar
        </label>
        <input
          id="lead-search"
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Nombre, teléfono, lead ID…"
          className="mt-1 w-56 rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:border-bronze-deep focus:outline-none"
        />
      </div>

      <div>
        <label htmlFor="lead-status" className="block text-xs font-medium uppercase tracking-wide text-ink-soft">
          Estado
        </label>
        <select
          id="lead-status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="mt-1 rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink focus:border-bronze-deep focus:outline-none"
        >
          <option value="">Todos</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {LEAD_STATUS_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="lead-source" className="block text-xs font-medium uppercase tracking-wide text-ink-soft">
          Fuente
        </label>
        <input
          id="lead-source"
          type="text"
          value={source}
          onChange={(e) => setSource(e.target.value)}
          placeholder="utm_source…"
          className="mt-1 w-40 rounded-sm border border-line bg-white px-3 py-2 text-sm text-ink placeholder:text-ink-soft/60 focus:border-bronze-deep focus:outline-none"
        />
      </div>

      <button
        type="submit"
        className="rounded-sm bg-ink px-4 py-2 text-sm font-semibold text-paper transition-colors hover:bg-ink-soft"
      >
        Filtrar
      </button>

      {(search || status || source) ? (
        <button
          type="button"
          onClick={() => router.push("/admin/leads")}
          className="rounded-sm px-3 py-2 text-sm font-semibold text-ink-soft hover:text-ink"
        >
          Limpiar
        </button>
      ) : null}
    </form>
  );
}
