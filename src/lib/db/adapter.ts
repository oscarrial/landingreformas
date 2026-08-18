import type {
  DashboardMetrics,
  Lead,
  LeadCreateInput,
  LeadListParams,
  LeadListResult,
  LeadUpdatePatch,
} from "@/lib/db/types";

/**
 * Persistence boundary. UI / routes depend on this interface, never on a
 * concrete DB. Swap `memory` → `postgres` by setting DATABASE_URL.
 */
export interface LeadRepository {
  create(input: LeadCreateInput): Promise<Lead>;
  findById(id: number): Promise<Lead | null>;
  findByLeadId(leadId: string): Promise<Lead | null>;
  list(params: LeadListParams): Promise<LeadListResult>;
  update(id: number, patch: LeadUpdatePatch): Promise<Lead | null>;
  metrics(): Promise<DashboardMetrics>;
  exportAll(): Promise<Lead[]>;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
