import type { MetadataRoute } from "next";

import { getBlogRepository, ensureSchema } from "@/lib/db";
import { siteConfig } from "@/config/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/reformas", priority: 0.9, changeFrequency: "monthly" },
    { path: "/reformas-integrales-madrid", priority: 0.9, changeFrequency: "monthly" },
    { path: "/reformas-pisos-madrid", priority: 0.8, changeFrequency: "monthly" },
    { path: "/reformas-cocinas-madrid", priority: 0.8, changeFrequency: "monthly" },
    { path: "/reformas-banos-madrid", priority: 0.8, changeFrequency: "monthly" },
    { path: "/proyectos", priority: 0.6, changeFrequency: "monthly" },
    { path: "/presupuesto", priority: 0.9, changeFrequency: "monthly" },
    { path: "/blog", priority: 0.6, changeFrequency: "weekly" },
    { path: "/aviso-legal", priority: 0.2, changeFrequency: "yearly" },
    { path: "/privacidad", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
  ] as const;

  const entries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  // Published blog posts (skipped when the schema is not ready yet).
  try {
    await ensureSchema();
    const repo = getBlogRepository();
    const posts = await repo.listPublished();
    for (const post of posts) {
      entries.push({
        url: `${siteConfig.url}/blog/${post.slug}`,
        lastModified: post.updated_at ? new Date(post.updated_at) : new Date(),
        changeFrequency: "monthly",
        priority: 0.5,
      });
    }
  } catch {
    // A failing blog query must never break the sitemap.
  }

  return entries;
}