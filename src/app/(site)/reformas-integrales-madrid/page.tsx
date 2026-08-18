import { getService } from "@/config/services";
import { ServicePage } from "@/components/service-page";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

const slug = "reformas-integrales-madrid";

export const metadata = buildMetadata({
  title: "Reformas integrales en Madrid",
  description:
    "Reformas integrales de viviendas en Madrid. Un único interlocutor, presupuesto cerrado y coordinación de todas las fases de la obra.",
  path: `/${slug}`,
});

export default function ReformasIntegralesPage() {
  const service = getService(slug)!;

  const schemas = [
    breadcrumbSchema([
      { label: "Inicio", href: "/" },
      { label: "Reformas integrales", href: `/${slug}` },
    ]),
    faqSchema(service.faqs),
  ];

  return <ServicePage service={service} schemas={schemas} />;
}
