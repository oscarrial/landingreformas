import postgres from "postgres";

import type { LeadRepository } from "@/lib/db/adapter";
import type {
  DashboardMetrics,
  Lead,
  LeadCreateInput,
  LeadListParams,
  LeadListResult,
  LeadUpdatePatch,
} from "@/lib/db/types";
import type { LeadStatus } from "@/lib/db/types";

/**
 * PostgreSQL adapter via postgres.js. Serverless-friendly (connection pool
 * per instance). Requires DATABASE_URL. Supabase, RDS, Vercel Postgres etc.
 * all speak this protocol.
 */

let sql: postgres.Sql | null = null;

function getSql(): postgres.Sql {
  if (!sql) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Configure it or use the memory adapter for local dev."
      );
    }
    sql = postgres(url, { max: 5 });
  }
  return sql;
}

export const LEAD_TABLE = "leads";

export async function migrate(): Promise<void> {
  const db = getSql();
  await db`
    CREATE TABLE IF NOT EXISTS ${db(LEAD_TABLE)} (
      id                BIGSERIAL PRIMARY KEY,
      lead_id           TEXT NOT NULL UNIQUE,
      created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
      updated_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
      status            TEXT NOT NULL DEFAULT 'new',
      name              TEXT NOT NULL,
      phone             TEXT NOT NULL,
      email             TEXT,
      reform_type       TEXT NOT NULL,
      area              TEXT,
      size_m2           NUMERIC,
      property_type     TEXT,
      postal_code       TEXT,
      property_size     TEXT,
      start_timeframe   TEXT NOT NULL,
      landing_page      TEXT,
      referrer          TEXT,
      utm_source        TEXT,
      utm_medium        TEXT,
      utm_campaign      TEXT,
      utm_term          TEXT,
      utm_content       TEXT,
      gclid             TEXT,
      gbraid            TEXT,
      wbraid            TEXT,
      fbclid            TEXT,
      msclkid           TEXT,
      first_touch_source TEXT,
      first_touch_landing TEXT,
      last_touch_source  TEXT,
      last_touch_landing TEXT,
      user_agent        TEXT,
      consent_at        TIMESTAMPTZ,
      assigned_provider TEXT,
      quote_amount      NUMERIC(12,2),
      contract_amount   NUMERIC(12,2),
      collected_amount  NUMERIC(12,2),
      lost_reason       TEXT,
      internal_notes    TEXT,
      commission_rate   NUMERIC(5,4) NOT NULL DEFAULT 0.05,
      commission_basis  TEXT NOT NULL DEFAULT 'collected_amount',
      notify_status     TEXT
    );
  `;
}

interface LeadRow {
  id: string;
  lead_id: string;
  created_at: Date;
  updated_at: Date;
  status: string;
  name: string;
  phone: string;
  email: string | null;
  reform_type: string;
  area: string | null;
  size_m2: string | null;
  property_type: string | null;
  postal_code: string | null;
  property_size: string | null;
  start_timeframe: string;
  landing_page: string | null;
  referrer: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  gclid: string | null;
  gbraid: string | null;
  wbraid: string | null;
  fbclid: string | null;
  msclkid: string | null;
  first_touch_source: string | null;
  first_touch_landing: string | null;
  last_touch_source: string | null;
  last_touch_landing: string | null;
  user_agent: string | null;
  consent_at: Date | null;
  assigned_provider: string | null;
  quote_amount: string | null;
  contract_amount: string | null;
  collected_amount: string | null;
  lost_reason: string | null;
  internal_notes: string | null;
  commission_rate: string;
  commission_basis: string;
  notify_status: string | null;
}

function toNumber(v: string | null): number | null {
  if (v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

function mapRow(r: LeadRow): Lead {
  return {
    id: Number(r.id),
    lead_id: r.lead_id,
    created_at: r.created_at.toISOString(),
    updated_at: r.updated_at.toISOString(),
    status: r.status as LeadStatus,
    name: r.name,
    phone: r.phone,
    email: r.email,
    reform_type: r.reform_type,
    area: r.area,
    size_m2: toNumber(r.size_m2),
    property_type: r.property_type,
    postal_code: r.postal_code,
    property_size: r.property_size,
    start_timeframe: r.start_timeframe,
    attribution: {
      landing_page: r.landing_page,
      referrer: r.referrer,
      utm_source: r.utm_source,
      utm_medium: r.utm_medium,
      utm_campaign: r.utm_campaign,
      utm_term: r.utm_term,
      utm_content: r.utm_content,
      gclid: r.gclid,
      gbraid: r.gbraid,
      wbraid: r.wbraid,
      fbclid: r.fbclid,
      msclkid: r.msclkid,
      first_touch_source: r.first_touch_source,
      first_touch_landing: r.first_touch_landing,
      last_touch_source: r.last_touch_source,
      last_touch_landing: r.last_touch_landing,
    },
    user_agent: r.user_agent,
    consent_at: r.consent_at ? r.consent_at.toISOString() : "",
    assigned_provider: r.assigned_provider,
    quote_amount: toNumber(r.quote_amount),
    contract_amount: toNumber(r.contract_amount),
    collected_amount: toNumber(r.collected_amount),
    lost_reason: r.lost_reason,
    internal_notes: r.internal_notes,
    commission_rate: toNumber(r.commission_rate) ?? 0.05,
    commission_basis: r.commission_basis as Lead["commission_basis"],
    notify_status: (r.notify_status as Lead["notify_status"]) ?? null,
  };
}

export const postgresRepository: LeadRepository = {
  async create(input: LeadCreateInput): Promise<Lead> {
    const db = getSql();
    const a = input.attribution;
    const rows = await db<LeadRow[]>`
      INSERT INTO ${db(LEAD_TABLE)} (
        lead_id, status, name, phone, email, reform_type,
        area, size_m2, start_timeframe,
        landing_page, referrer, utm_source, utm_medium, utm_campaign,
        utm_term, utm_content, gclid, gbraid, wbraid, fbclid, msclkid,
        first_touch_source, first_touch_landing, last_touch_source,
        last_touch_landing, user_agent, consent_at
      ) VALUES (
        ${input.lead_id}, 'new', ${input.name}, ${input.phone}, ${input.email},
        ${input.reform_type}, ${input.area}, ${input.size_m2},
        ${input.start_timeframe},
        ${a.landing_page}, ${a.referrer}, ${a.utm_source}, ${a.utm_medium},
        ${a.utm_campaign}, ${a.utm_term}, ${a.utm_content}, ${a.gclid},
        ${a.gbraid}, ${a.wbraid}, ${a.fbclid}, ${a.msclkid},
        ${a.first_touch_source}, ${a.first_touch_landing},
        ${a.last_touch_source}, ${a.last_touch_landing},
        ${input.user_agent}, ${input.consent_at}
      )
      RETURNING *;
    `;
    return mapRow(rows[0]!);
  },

  async findById(id: number): Promise<Lead | null> {
    const db = getSql();
    const rows = await db<LeadRow[]>`SELECT * FROM ${db(LEAD_TABLE)} WHERE id = ${id}`;
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async findByLeadId(leadId: string): Promise<Lead | null> {
    const db = getSql();
    const rows = await db<LeadRow[]>`SELECT * FROM ${db(LEAD_TABLE)} WHERE lead_id = ${leadId}`;
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async list(params: LeadListParams): Promise<LeadListResult> {
    const db = getSql();
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    const offset = (page - 1) * pageSize;

    const where = db`
      WHERE (
        ${params.search ? db`name ILIKE ${`%${params.search}%`}` : db`true`}
        ${params.search ? db`OR phone ILIKE ${`%${params.search}%`}` : db``}
        ${params.search ? db`OR lead_id ILIKE ${`%${params.search}%`}` : db``}
        ${params.search ? db`OR area ILIKE ${`%${params.search}%`}` : db``}
      )
      ${params.status ? db`AND status = ${params.status}` : db``}
      ${params.source ? db`AND COALESCE(utm_source, 'direct') = ${params.source}` : db``}
    `;

    const countRows = await db<{ count: string }[]>`SELECT COUNT(*)::text as count FROM ${db(LEAD_TABLE)} ${where}`;
    const total = Number(countRows[0]?.count ?? 0);

    const rows = await db<LeadRow[]>`
      SELECT * FROM ${db(LEAD_TABLE)}
      ${where}
      ORDER BY created_at DESC
      LIMIT ${pageSize} OFFSET ${offset}
    `;

    return { items: rows.map(mapRow), total, page, pageSize };
  },

  async update(id: number, patch: LeadUpdatePatch): Promise<Lead | null> {
    const db = getSql();
    const existing = await postgresRepository.findById(id);
    if (!existing) return null;

    const sets: string[] = [];
    const vals: (string | number | null)[] = [];

    const push = (col: string, v: string | number | null) => {
      sets.push(`${col} = $${vals.length + 1}`);
      vals.push(v);
    };

    if (patch.status !== undefined) push("status", patch.status);
    if (patch.assigned_provider !== undefined)
      push("assigned_provider", patch.assigned_provider);
    if (patch.quote_amount !== undefined) push("quote_amount", patch.quote_amount);
    if (patch.contract_amount !== undefined)
      push("contract_amount", patch.contract_amount);
    if (patch.collected_amount !== undefined)
      push("collected_amount", patch.collected_amount);
    if (patch.lost_reason !== undefined) push("lost_reason", patch.lost_reason);
    if (patch.internal_notes !== undefined)
      push("internal_notes", patch.internal_notes);
    if (patch.commission_rate !== undefined)
      push("commission_rate", patch.commission_rate);
    if (patch.commission_basis !== undefined)
      push("commission_basis", patch.commission_basis);
    if (patch.notify_status !== undefined) push("notify_status", patch.notify_status);

    push("updated_at", new Date().toISOString());

    const query =
      `UPDATE ${LEAD_TABLE} SET ${sets.join(", ")} WHERE id = $${vals.length + 1} RETURNING *`;
    const rows = await db.unsafe<LeadRow[]>(query, [...vals, id]);
    return rows[0] ? mapRow(rows[0]) : null;
  },

  async metrics(): Promise<DashboardMetrics> {
    const db = getSql();
    const rows = await db<{ status: string; count: string }[]>`
      SELECT status, COUNT(*)::text as count FROM ${db(LEAD_TABLE)} GROUP BY status
    `;

    const byStatus: Partial<Record<LeadStatus, number>> = {};
    let totalLeads = 0;
    for (const r of rows) {
      const n = Number(r.count);
      byStatus[r.status as LeadStatus] = n;
      totalLeads += n;
    }

    const sums = await db<{
      qualified: string;
      quotes: string;
      won: string;
      contracted: string;
      collected: string;
    }[]>`
      SELECT
        COUNT(*) FILTER (WHERE status IN ('qualified','visit_scheduled','quote_sent','won'))::text AS qualified,
        COUNT(*) FILTER (WHERE status = 'quote_sent')::text AS quotes,
        COUNT(*) FILTER (WHERE status = 'won')::text AS won,
        COALESCE(SUM(contract_amount) FILTER (WHERE status = 'won'), 0)::text AS contracted,
        COALESCE(SUM(collected_amount) FILTER (WHERE status = 'won'), 0)::text AS collected
      FROM ${db(LEAD_TABLE)}
    `;
    const s = sums[0]!;
    const collectedValue = Number(s.collected);
    const contractedValue = Number(s.contracted);
    const collectedBasisLeads = await db<{ sum: string }[]>`
      SELECT COALESCE(SUM(collected_amount), 0)::text AS sum
      FROM ${db(LEAD_TABLE)} WHERE status = 'won' AND commission_basis = 'collected_amount'
    `;
    const contractBasisLeads = await db<{ sum: string }[]>`
      SELECT COALESCE(SUM(contract_amount), 0)::text AS sum
      FROM ${db(LEAD_TABLE)} WHERE status = 'won' AND commission_basis = 'contract_amount'
    `;
    const attributedCommission =
      Number(collectedBasisLeads[0]?.sum ?? 0) +
      Number(contractBasisLeads[0]?.sum ?? 0);

    return {
      totalLeads,
      qualifiedLeads: Number(s.qualified),
      quotesSent: Number(s.quotes),
      wonLeads: Number(s.won),
      contractedValue,
      collectedValue,
      attributedCommission: attributedCommission * 0.05,
      byStatus,
    };
  },

  async exportAll(): Promise<Lead[]> {
    const db = getSql();
    const rows = await db<LeadRow[]>`SELECT * FROM ${db(LEAD_TABLE)} ORDER BY created_at DESC`;
    return rows.map(mapRow);
  },
};
