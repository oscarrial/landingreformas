import Link from "next/link";

import { getLeadRepository } from "@/lib/db";
import { formatDateShort } from "@/lib/format";
import { LeadFilters } from "@/components/admin/lead-filters";
import { STATUS_BADGE_CLASSES } from "@/components/admin/lead-status";

interface LeadsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    source?: string;
    page?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function LeadsPage({ searchParams }: LeadsPageProps) {
  const params = await searchParams;
  const page = Math.max(1, Number(params.page ?? 1) || 1);
  const pageSize = 20;

  const repo = getLeadRepository();
  const result = await repo.list({
    search: params.search?.trim() || undefined,
    status: params.status as never,
    source: params.source?.trim() || undefined,
    page,
    pageSize,
  });

  const totalPages = Math.max(1, Math.ceil(result.total / pageSize));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl text-ink">Leads</h1>
          <p className="text-sm text-ink-soft">
            {result.total} {result.total === 1 ? "lead" : "leads"}
          </p>
        </div>
        <Link
          href="/api/admin/leads/export"
          className="rounded-sm border border-ink px-4 py-2.5 text-sm font-semibold text-ink transition-colors hover:bg-sand"
        >
          Exportar CSV
        </Link>
      </div>

      <LeadFilters />

      <div className="mt-6 overflow-x-auto rounded-sm border border-line bg-paper">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line">
            <tr className="text-xs uppercase tracking-[0.14em] text-ink-soft">
              <th className="px-4 py-3 font-medium">Lead ID</th>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="px-4 py-3 font-medium">Reforma</th>
              <th className="px-4 py-3 font-medium">CP</th>
              <th className="px-4 py-3 font-medium">Fuente</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line-soft">
            {result.items.map((lead) => (
              <tr key={lead.id} className="hover:bg-sand">
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${lead.id}`} className="font-mono text-xs text-bronze-deep hover:underline">
                    {lead.lead_id}
                  </Link>
                </td>
                <td className="px-4 py-3 font-medium text-ink">{lead.name}</td>
                <td className="px-4 py-3 text-ink-soft">{reformLabel(lead.reform_type)}</td>
                <td className="px-4 py-3 text-ink-soft">{lead.postal_code}</td>
                <td className="px-4 py-3 text-ink-soft">
                  {lead.attribution.utm_source ?? lead.attribution.first_touch_source ?? "direct"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={lead.status} />
                </td>
                <td className="px-4 py-3 text-ink-soft">{formatDateShort(lead.created_at)}</td>
              </tr>
            ))}
            {result.items.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-ink-soft">
                  No hay leads que coincidan con los filtros.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} />
    </div>
  );
}

function reformLabel(value: string): string {
  const labels: Record<string, string> = {
    integral: "Integral",
    cocina: "Cocina",
    bano: "Baño",
    varias: "Varias",
    otro: "Otro",
  };
  return labels[value] ?? value;
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={STATUS_BADGE_CLASSES[status] ?? "bg-line text-ink-soft"}>
      {statusLabel(status)}
    </span>
  );
}

function statusLabel(status: string): string {
  const labels: Record<string, string> = {
    new: "Nuevo",
    contacted: "Contactado",
    qualified: "Cualificado",
    visit_scheduled: "Visita",
    quote_sent: "Presupuesto",
    won: "Ganado",
    lost: "Perdido",
  };
  return labels[status] ?? status;
}

function Pagination({ page, totalPages }: { page: number; totalPages: number }) {
  if (totalPages <= 1) return null;
  return (
    <nav className="mt-6 flex items-center justify-between text-sm" aria-label="Paginación">
      <p className="text-ink-soft">
        Página {page} de {totalPages}
      </p>
      <div className="flex gap-2">
        {page > 1 ? <PageLink page={page - 1} label="Anterior" /> : null}
        {page < totalPages ? <PageLink page={page + 1} label="Siguiente" /> : null}
      </div>
    </nav>
  );
}

function PageLink({ page, label }: { page: number; label: string }) {
  return (
    <Link
      href={`/admin/leads?page=${page}`}
      className="rounded-sm border border-line px-3 py-1.5 font-semibold text-ink transition-colors hover:border-bronze"
    >
      {label}
    </Link>
  );
}
