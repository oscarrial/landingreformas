import { siteConfig } from "@/config/site";
import type { LeadRepository } from "@/lib/db/adapter";
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
import { LEAD_STATUSES, type LeadStatus } from "@/lib/db/types";

/**
 * In-memory adapter for LOCAL DEV AND TESTS only.
 * IMPORTANT: never used when DATABASE_URL is set. It is NOT suitable for
 * production — it loses all data on restart. The route layer logs a warning
 * when it falls back to this adapter.
 */

const store = new Map<number, Lead>();
let seq = 0;

export function resetMemoryDb(): void {
  store.clear();
  seq = 0;
}

function nowIso(): string {
  return new Date().toISOString();
}

function nextId(): number {
  seq += 1;
  return seq;
}

export const memoryRepository: LeadRepository = {
  async create(input: LeadCreateInput): Promise<Lead> {
    const id = nextId();
    const ts = nowIso();
    const lead: Lead = {
      ...input,
      id,
      created_at: ts,
      updated_at: ts,
      status: "new",
      property_type: null,
      postal_code: null,
      property_size: null,
      assigned_provider: null,
      quote_amount: null,
      contract_amount: null,
      collected_amount: null,
      lost_reason: null,
      internal_notes: null,
      commission_rate: siteConfig.commissionRate,
      commission_basis: siteConfig.commissionBasis,
      notify_status: null,
    };
    store.set(id, lead);
    return lead;
  },

  async findById(id: number): Promise<Lead | null> {
    return store.get(id) ?? null;
  },

  async findByLeadId(leadId: string): Promise<Lead | null> {
    for (const lead of store.values()) {
      if (lead.lead_id === leadId) return lead;
    }
    return null;
  },

  async list(params: LeadListParams): Promise<LeadListResult> {
    const page = params.page ?? 1;
    const pageSize = params.pageSize ?? 20;
    let items = [...store.values()].sort(
      (a, b) => b.created_at.localeCompare(a.created_at)
    );

    if (params.search) {
      const q = params.search.toLowerCase();
      items = items.filter(
        (l) =>
          l.name.toLowerCase().includes(q) ||
          l.phone.includes(params.search!) ||
          l.lead_id.toLowerCase().includes(q) ||
          (l.area ?? "").toLowerCase().includes(q)
      );
    }
    if (params.status) {
      items = items.filter((l) => l.status === params.status);
    }
    if (params.source) {
      items = items.filter(
        (l) => (l.attribution.utm_source ?? "direct") === params.source
      );
    }

    const total = items.length;
    const start = (page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), total, page, pageSize };
  },

  async update(id: number, patch: LeadUpdatePatch): Promise<Lead | null> {
    const lead = store.get(id);
    if (!lead) return null;
    const updated: Lead = { ...lead, ...patch, updated_at: nowIso() };
    store.set(id, updated);
    return updated;
  },

  async metrics(): Promise<DashboardMetrics> {
    const all = [...store.values()];
    const byStatus: Partial<Record<LeadStatus, number>> = {};
    for (const s of LEAD_STATUSES) byStatus[s] = 0;
    for (const l of all) byStatus[l.status] = (byStatus[l.status] ?? 0) + 1;

    const qualifiedLeads = all.filter((l) =>
      ["qualified", "visit_scheduled", "quote_sent", "won"].includes(l.status)
    ).length;
    const won = all.filter((l) => l.status === "won");
    const contractedValue = won.reduce(
      (acc, l) => acc + (l.contract_amount ?? 0),
      0
    );
    const collectedValue = won.reduce(
      (acc, l) => acc + (l.collected_amount ?? 0),
      0
    );
    const attributedCommission = won.reduce((acc, l) => {
      const base =
        l.commission_basis === "contract_amount"
          ? l.contract_amount
          : l.collected_amount;
      return acc + (base ?? 0) * l.commission_rate;
    }, 0);

    return {
      totalLeads: all.length,
      qualifiedLeads,
      quotesSent: byStatus["quote_sent"] ?? 0,
      wonLeads: won.length,
      contractedValue,
      collectedValue,
      attributedCommission,
      byStatus,
    };
  },

  async exportAll(): Promise<Lead[]> {
    return [...store.values()].sort(
      (a, b) => b.created_at.localeCompare(a.created_at)
    );
  },
};

/* ------------------------------------------------------------------
   Blog posts (in-memory — mirrors blogPostgresRepository)
------------------------------------------------------------------ */

const blogStore = new Map<number, BlogPost>();
let blogSeq = 0;

export function resetBlogMemoryDb(): void {
  blogStore.clear();
  blogSeq = 0;
}

function blogNow(): string {
  return new Date().toISOString();
}

function blogNextId(): number {
  blogSeq += 1;
  return blogSeq;
}

function sortPosts(items: BlogPost[]): BlogPost[] {
  return items.sort((a, b) => {
    const aPub = a.published_at ?? "0";
    const bPub = b.published_at ?? "0";
    if (aPub !== bPub) return bPub.localeCompare(aPub);
    return b.updated_at.localeCompare(a.updated_at);
  });
}

export const blogMemoryRepository = {
  async listPosts(
    params: { status?: BlogPostStatus; page?: number; pageSize?: number } = {}
  ): Promise<{ items: BlogPost[]; total: number }> {
    const page = Math.max(1, params.page ?? 1);
    const pageSize = Math.min(100, Math.max(1, params.pageSize ?? 20));
    let items = [...blogStore.values()];
    if (params.status) items = items.filter((p) => p.status === params.status);
    items = sortPosts(items);
    const start = (page - 1) * pageSize;
    return { items: items.slice(start, start + pageSize), total: items.length };
  },

  async listPublished(): Promise<BlogPost[]> {
    return sortPosts(
      [...blogStore.values()].filter((p) => p.status === "published")
    );
  },

  async getPostBySlug(slug: string): Promise<BlogPost | null> {
    for (const post of blogStore.values()) {
      if (post.slug === slug) return post;
    }
    return null;
  },

  async createPost(input: BlogPostInput): Promise<BlogPost> {
    const ts = blogNow();
    const post: BlogPost = {
      id: blogNextId(),
      slug: input.slug,
      title: input.title,
      excerpt: input.excerpt,
      content: input.content,
      status: input.status,
      published_at: input.status === "published" ? ts : null,
      created_at: ts,
      updated_at: ts,
    };
    blogStore.set(post.id, post);
    return post;
  },

  async updatePost(id: number, patch: BlogPostPatch): Promise<BlogPost | null> {
    const post = blogStore.get(id);
    if (!post) return null;
    const updated: BlogPost = {
      ...post,
      ...patch,
      published_at:
        patch.status === "published" && !post.published_at
          ? blogNow()
          : post.published_at,
      updated_at: blogNow(),
    };
    blogStore.set(id, updated);
    return updated;
  },

  async deletePost(id: number): Promise<boolean> {
    return blogStore.delete(id);
  },
};
