import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

/**
 * robots.txt.
 * - Public content is allowed; admin and admin API are disallowed.
 * - Staging / previews: set NEXT_PUBLIC_NOINDEX=1 (or leave SITE_URL unset)
 *   to tell crawlers to stay out entirely. robots.txt is not a security
 *   boundary — /admin is additionally protected by auth.
 */
function shouldBlockCrawlers(): boolean {
  return (
    process.env.NEXT_PUBLIC_NOINDEX === "1" ||
    !process.env.NEXT_PUBLIC_SITE_URL
  );
}

export default function robots(): MetadataRoute.Robots {
  if (shouldBlockCrawlers()) {
    return {
      rules: { userAgent: "*", disallow: "/" },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/api/admin"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
