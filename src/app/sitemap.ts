import type { MetadataRoute } from "next";

import { siteConfig } from "@/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = [
    { path: "/", priority: 1, changeFrequency: "weekly" },
    { path: "/reformas", priority: 0.9, changeFrequency: "monthly" },
    { path: "/reformas-integrales-madrid", priority: 0.9, changeFrequency: "monthly" },
    { path: "/reformas-pisos-madrid", priority: 0.8, changeFrequency: "monthly" },
    { path: "/reformas-cocinas-madrid", priority: 0.8, changeFrequency: "monthly" },
    { path: "/reformas-banos-madrid", priority: 0.8, changeFrequency: "monthly" },
    { path: "/proyectos", priority: 0.6, changeFrequency: "monthly" },
    { path: "/presupuesto", priority: 0.9, changeFrequency: "monthly" },
    { path: "/aviso-legal", priority: 0.2, changeFrequency: "yearly" },
    { path: "/privacidad", priority: 0.2, changeFrequency: "yearly" },
    { path: "/cookies", priority: 0.2, changeFrequency: "yearly" },
  ] as const;

  return routes.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    lastModified: new Date(),
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
