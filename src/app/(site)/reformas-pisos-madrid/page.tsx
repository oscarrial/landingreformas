import { getService } from "@/config/services";
import { ServicePage } from "@/components/service-page";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

const slug = "reformas-pisos-madrid";

export const metadata = buildMetadata({
  title: "Reformas de pisos en Madrid",
  description:
    "Reforma de pisos en Madrid: renovación completa o redistribución de espacios. Presupuesto cerrado, un único interlocutor y coordinación con la comunidad.",
  path: `/${slug}`,
});

export default function ReformasPisosPage() {
  const service = getService(slug)!;

  const schemas = [
    breadcrumbSchema([
      { label: "Inicio", href: "/" },
      { label: "Reformas de pisos", href: `/${slug}` },
    ]),
    faqSchema(service.faqs),
  ];

  return <ServicePage service={service} schemas={schemas} />;
}
