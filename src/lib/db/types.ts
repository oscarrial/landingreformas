import type { CommissionBasis } from "@/config/site";
export type LeadStatus =
  | "new"
  | "contacted"
  | "qualified"
  | "visit_scheduled"
  | "quote_sent"
  | "won"
  | "lost";

export const LEAD_STATUSES: LeadStatus[] = [
  "new",
  "contacted",
  "qualified",
  "visit_scheduled",
  "quote_sent",
  "won",
  "lost",
];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: "Nuevo",
  contacted: "Contactado",
  qualified: "Cualificado",
  visit_scheduled: "Visita programada",
  quote_sent: "Presupuesto enviado",
  won: "Ganado",
  lost: "Perdido",
};

export type NotifyStatus = "pending" | "sent" | "failed" | "disabled";

export type BlogPostStatus = "draft" | "published";

export const BLOG_STATUSES: BlogPostStatus[] = ["draft", "published"];

/** A blog entry managed from the admin panel. */
export interface BlogPost {
  id: number;
  slug: string;
  title: string;
  /** Short summary shown in listings and used as meta description. */
  excerpt: string;
  /** Body text. Paragraphs split by blank lines; "## " = h2; "- " = bullets. */
  content: string;
  status: BlogPostStatus;
  /** Set the first time the post is published; preserved afterwards. */
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface BlogPostInput {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  status: BlogPostStatus;
}

export type BlogPostPatch = Partial<BlogPostInput>;

/** Attribution captured at lead creation time (first-party tracking). */
export interface LeadAttribution {
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
}

/** The fully normalized payload used to create a lead. */
export interface LeadCreateInput {
  lead_id: string;
  name: string;
  phone: string;
  email: string | null;
  reform_type: string;
  area: string | null;
  size_m2: number | null;
  start_timeframe: string;
  attribution: LeadAttribution;
  user_agent: string | null;
  consent_at: string;
}

export interface Lead extends LeadCreateInput {
  id: number;
  created_at: string;
  updated_at: string;
  status: LeadStatus;
  /** Legacy fields from an earlier form version — now nullable. */
  property_type: string | null;
  postal_code: string | null;
  property_size: string | null;
  assigned_provider: string | null;
  quote_amount: number | null;
  contract_amount: number | null;
  collected_amount: number | null;
  lost_reason: string | null;
  internal_notes: string | null;
  commission_rate: number;
  commission_basis: CommissionBasis;
  notify_status: NotifyStatus | null;
}

export type LeadUpdatePatch = Partial<{
  status: LeadStatus;
  assigned_provider: string | null;
  quote_amount: number | null;
  contract_amount: number | null;
  collected_amount: number | null;
  lost_reason: string | null;
  internal_notes: string | null;
  commission_rate: number;
  commission_basis: CommissionBasis;
  notify_status: NotifyStatus;
}>;

export interface LeadListParams {
  search?: string;
  status?: LeadStatus;
  source?: string;
  page?: number;
  pageSize?: number;
}

export interface LeadListResult {
  items: Lead[];
  total: number;
  page: number;
  pageSize: number;
}

export interface DashboardMetrics {
  totalLeads: number;
  qualifiedLeads: number;
  quotesSent: number;
  wonLeads: number;
  contractedValue: number;
  collectedValue: number;
  attributedCommission: number;
  byStatus: Partial<Record<LeadStatus, number>>;
}
