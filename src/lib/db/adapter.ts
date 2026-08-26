import type {
  BlogPost,
  BlogPostInput,
  BlogPostPatch,
  BlogPostStatus,
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

/** Blog posts persistence boundary (same swap strategy as leads). */
export interface BlogRepository {
  listPosts(params?: {
    status?: BlogPostStatus;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: BlogPost[]; total: number }>;
  /** Published posts, newest first — the only view the public blog uses. */
  listPublished(): Promise<BlogPost[]>;
  getPostBySlug(slug: string): Promise<BlogPost | null>;
  createPost(input: BlogPostInput): Promise<BlogPost>;
  updatePost(id: number, patch: BlogPostPatch): Promise<BlogPost | null>;
  deletePost(id: number): Promise<boolean>;
}

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}
