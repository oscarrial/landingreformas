import type { Metadata } from "next";

import { siteConfig } from "@/config/site";

export interface BuildMetadataArgs {
  /** Page title (without brand suffix). */
  title: string;
  description: string;
  /** Path, e.g. "/reformas-cocinas-madrid". */
  path: string;
  noindex?: boolean;
  /** Optional OpenGraph / Twitter image (absolute URL). */
  ogImage?: string;
  /** Optional canonical override (defaults to site URL + path). */
  canonical?: string;
  /** Open Graph type, default "website". */
  ogType?: "website" | "article";
}

/** Staging / previews: set NEXT_PUBLIC_NOINDEX=1 to keep crawlers out. */
function stagingNoindex(): boolean {
  return process.env.NEXT_PUBLIC_NOINDEX === "1";
}

/**
 * Builds consistent Metadata per page: title, description, canonical,
 * Open Graph, Twitter cards and robots. Brand details come from siteConfig.
 */
export function buildMetadata({
  title,
  description,
  path,
  noindex = false,
  ogImage,
  canonical,
  ogType = "website",
}: BuildMetadataArgs): Metadata {
  const url = canonical ?? `${siteConfig.url}${path}`;
  const robots = noindex || stagingNoindex()
    ? { index: false, follow: false }
    : { index: true, follow: true };
  const images = ogImage ? [{ url: ogImage }] : undefined;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: ogType,
      locale: "es_ES",
      url,
      siteName: siteConfig.brandName,
      title,
      description,
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(images ? { images } : {}),
    },
    robots,
  };
}
