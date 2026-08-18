import { siteConfig } from "@/config/site";
import type { FaqItem } from "@/config/services";

/**
 * JSON-LD structured data builders.
 * IMPORTANT: we never declare LocalBusiness, ratings, reviews or addresses
 * that we cannot honestly back. Only Organization (name/url), WebSite,
 * FAQPage and BreadcrumbList are emitted.
 */

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.brandName,
    url: siteConfig.url,
    description: siteConfig.tagline,
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.brandName,
    url: siteConfig.url,
  };
}

export function faqSchema(faqs: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };
}

export function breadcrumbSchema(items: { label: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      item: `${siteConfig.url}${item.href}`,
    })),
  };
}

/**
 * Service schema — only emitted when the content is honest (provider is our
 * own Organization, no invented address/rating/price range).
 */
export function serviceSchema(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    provider: { "@type": "Organization", name: siteConfig.brandName, url: siteConfig.url },
    areaServed: "Madrid y Comunidad de Madrid",
    serviceType: name,
  };
}
