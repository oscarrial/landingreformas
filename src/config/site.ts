/**
 * SITE CONFIGURATION
 * ====================================================================
 * Central source of truth for everything brand / provider / legal /
 * analytics related. Replace values here to rebrand the whole site.
 *
 * This is the ONLY place where the public brand name and operational
 * details (phone, provider, commission) live.
 * ====================================================================
 */

export type CommissionBasis = "contract_amount" | "collected_amount";

/** A third party that processes personal data on our behalf. */
export interface DataProcessor {
  /** `null` while the provider is still to be confirmed. */
  name: string | null;
  purpose: string;
}

export interface LegalConfig {
  /** Group trading name, as published: "Intelia". */
  tradeName: string;
  groupSite: string;
  /** Registered company name. `null` → still "pendiente" at group level. */
  companyName: string | null;
  nif: string | null;
  address: string | null;
  legalPhone: string | null;
  /** Address for legal notices and for exercising data-protection rights. */
  contactEmail: string;
  /** Data protection officer, or the group's published status. */
  dpo: string | null;
  retention: { general: string; accounting: string };
  /** RGPD legal bases relied on, as published by the group. */
  legalBases: { article: string; label: string }[];
  processors: DataProcessor[];
  authority: { name: string; url: string };
}

export interface SiteConfig {
  /** Brand name shown publicly. Currently provisional: "KOFLAT". */
  brandName: string;
  /** Short descriptor under the brand. */
  descriptor: string;
  /** One-line positioning. */
  tagline: string;

  /** Operational contact details — these are placeholders (TODO). */
  phone: string;
  /** WhatsApp number in international format, digits only. */
  whatsapp: string;
  /** Public contact email. */
  email: string;

  serviceArea: string;
  /** Mark of the interim operational provider. NOT shown publicly. */
  providerName: string;
  leadRecipient: string;

  /**
   * Company facts for trust sections. ONLY real, verifiable data.
   * `null` = unknown → the section is hidden or shows a clear placeholder.
   */
  company: {
    yearsExperience: number | null;
    projectsCompleted: number | null;
    googleRating: number | null;
    reviewCount: number | null;
    address: string;
  };

  /** Base URL used for canonical / sitemap / structured data. */
  url: string;

  /**
   * Commission paid to us on attributed operations.
   * Default 0.05 (5%). Configurable per lead; this is the default.
   * The basis (contract_amount | collected_amount) is configurable here
   * and per lead — do not assume legally which one applies.
   */
  commissionRate: number;
  commissionBasis: CommissionBasis;

  /** Legal entity that owns the capture brand. */
  legalCompany: string;
  /** Person/entity the privacy policy refers to. */
  dataController: string;

  /**
   * Legal and data-protection facts, taken from the group's own published
   * notices at intelia-group.com. Anything the group has not published yet is
   * `null` here so the pages can render an explicit "pendiente" instead of an
   * invented value.
   */
  legal: LegalConfig;

  /** Analytics IDs — leave empty to disable the tool entirely. */
  analytics: {
    gtmId: string;
    ga4Id: string;
    adsId: string;
  };

  /** Social links — empty strings to hide. */
  social: {
    instagram: string;
    linkedin: string;
  };

  /** Navigation items for the header/footer. */
  nav: {
    label: string;
    href: string;
  }[];
}

export const siteConfig: SiteConfig = {
  /* ------------------------------------------------------------------
     BRAND — provisional. Replace all of this to rebrand in minutes.
  ------------------------------------------------------------------ */
  brandName: "KOFLAT",
  descriptor: "Reformas en Madrid",
  tagline:
    "Tu reforma en Madrid, bien organizada desde el principio. Un único interlocutor y un presupuesto que se respeta.",

  /* ------------------------------------------------------------------
     CONTACT — TODO: replace with real numbers/emails before production.
  ------------------------------------------------------------------ */
  phone: "", // TODO: real phone number
  whatsapp: "", // TODO: real WhatsApp number (digits only, intl)
  email: "info@intelia-group.com", // real — group contact address
  serviceArea: "Madrid y Comunidad de Madrid",
  providerName: "NEXO GIR", // operational only — never shown publicly
  leadRecipient: "proveedor", // where the qualified lead is notified

  /* Company facts — ONLY real data. null = unknown → hidden in the UI. */
  company: {
    yearsExperience: 15, // real (provider)
    projectsCompleted: null, // TODO: confirm real figure
    googleRating: null, // TODO: confirm real Google rating
    reviewCount: null, // TODO: confirm real review count
    address: "", // TODO: real address
  },

  url: process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL ?? "https://koflat.es",

  /* ------------------------------------------------------------------
     ECONOMICS
  ------------------------------------------------------------------ */
  commissionRate: 0.05, // 5%
  commissionBasis: "collected_amount", // configurable — confirm legally

  /* ------------------------------------------------------------------
     LEGAL — the entity behind the capture brand.
  ------------------------------------------------------------------ */
  legalCompany: "INTELIA SOLUTIONS, SOCIEDAD DE RESPONSABILIDAD LIMITADA",
  dataController: "INTELIA SOLUTIONS, SOCIEDAD DE RESPONSABILIDAD LIMITADA",

  legal: {
    tradeName: "Intelia",
    groupSite: "https://intelia-group.com",
    companyName: "INTELIA SOLUTIONS, SOCIEDAD DE RESPONSABILIDAD LIMITADA",
    nif: "B88692702",
    address: "CM. POMBA, 42 - 36315 Vigo (Pontevedra)",
    legalPhone: null, // TODO: teléfono de contacto legal si aplica
    contactEmail: "info@intelia-group.com",
    dpo: null, // TODO: confirmar delegado de protección de datos si se designa
    retention: { general: "5 años", accounting: "6 años" },
    legalBases: [
      { article: "art. 6.1.a RGPD", label: "tu consentimiento" },
      {
        article: "art. 6.1.b RGPD",
        label: "la ejecución de la relación precontractual que solicitas",
      },
      { article: "art. 6.1.c RGPD", label: "el cumplimiento de obligaciones legales" },
    ],
    processors: [
      {
        name: "Google Ireland Ltd.",
        purpose: "Google Analytics 4 a través de Google Tag Manager",
      },
      { name: null, purpose: "Proveedor de email transaccional y de hosting" },
    ],
    authority: {
      name: "Agencia Española de Protección de Datos",
      url: "https://www.aepd.es",
    },
  },

  /* ------------------------------------------------------------------
     ANALYTICS — leave empty to keep tools disabled.
  ------------------------------------------------------------------ */
  analytics: {
    gtmId: process.env.NEXT_PUBLIC_GTM_ID ?? process.env.NEXT_PUBLIC_GTM_CONTAINER_ID ?? "",
    ga4Id: process.env.NEXT_PUBLIC_GA4_ID ?? "",
    adsId: process.env.NEXT_PUBLIC_ADS_ID ?? "",
  },

  /* ------------------------------------------------------------------
     SOCIAL
  ------------------------------------------------------------------ */
  social: {
    instagram: "", // TODO
    linkedin: "", // TODO
  },

  /* ------------------------------------------------------------------
     NAVIGATION
  ------------------------------------------------------------------ */
  // "Reformas" points at the hub page: three of the four service pages were
  // otherwise only reachable from the home grid and the footer.
  // "Opiniones" removed — the home has no testimonials section, so /#opiniones
  // was a dead anchor. Re-add it once that section exists.
  nav: [
    { label: "Reformas", href: "/reformas" },
    { label: "Proyectos", href: "/proyectos" },
    { label: "Blog", href: "/blog" },
    { label: "Cómo trabajamos", href: "/#proceso" },
    { label: "Preguntas frecuentes", href: "/#faq" },
  ],
};

/** Convenience for the main CTA label, reused across the site. */
export const PRIMARY_CTA_LABEL = "Quiero presupuesto";
export const CTA_ACTION_LABEL = "Pedir presupuesto";
