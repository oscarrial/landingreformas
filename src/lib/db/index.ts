import { isDbConfigured } from "@/lib/db/adapter";
import { memoryRepository, resetMemoryDb } from "@/lib/db/memory";
import { migrate, postgresRepository } from "@/lib/db/postgres";
import type { LeadRepository } from "@/lib/db/adapter";

let repo: LeadRepository | null = null;
let warned = false;

/**
 * Returns the configured lead repository.
 * - DATABASE_URL set  → PostgreSQL (production).
 * - otherwise         → in-memory adapter (local dev / tests). Loses data
 *                       on restart and is NOT production-safe.
 */
export function getLeadRepository(): LeadRepository {
  if (repo) return repo;
  let resolved: LeadRepository;
  if (isDbConfigured()) {
    resolved = postgresRepository;
  } else {
    if (!warned) {
      console.warn(
        "[db] DATABASE_URL not set — using in-memory lead storage. " +
          "Leads will be lost on restart. Configure DATABASE_URL for production."
      );
      warned = true;
    }
    resolved = memoryRepository;
  }
  repo = resolved;
  return resolved;
}

/** Ensures the schema exists (Postgres adapter). Safe to call on boot. */
export async function ensureSchema(): Promise<void> {
  if (isDbConfigured()) {
    await migrate();
  }
}

/** Test helper to reset state between tests. */
export function resetDb(): void {
  if (isDbConfigured()) {
    repo = null;
  } else {
    resetMemoryDb();
  }
}

/** Whether the app is running on the in-memory (dev) adapter. */
export function isUsingMemoryDb(): boolean {
  return !isDbConfigured();
}
