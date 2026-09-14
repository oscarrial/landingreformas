import { getService } from "@/config/services";
import { ServicePage } from "@/components/service-page";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

const slug = "reformas-humedades-madrid";

export const metadata = buildMetadata({
  title: "Tratamiento de humedades en Madrid",
  description:
    "Diagnóstico y tratamiento de humedades en Madrid: filtraciones, capilaridad y condensación. Presupuesto detallado por partidas y un único interlocutor.",
  path: `/${slug}`,
});

export default function ReformasHumedadesPage() {
  const service = getService(slug)!;

  const schemas = [
    breadcrumbSchema([
      { label: "Inicio", href: "/" },
      { label: "Tratamiento de humedades", href: `/${slug}` },
    ]),
    faqSchema(service.faqs),
  ];

  return <ServicePage service={service} schemas={schemas} />;
}
