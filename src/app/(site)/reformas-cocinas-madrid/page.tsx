import { getService } from "@/config/services";
import { ServicePage } from "@/components/service-page";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

const slug = "reformas-cocinas-madrid";

export const metadata = buildMetadata({
  title: "Reformas de cocinas en Madrid",
  description:
    "Reforma de cocinas en Madrid con coordinación de instalaciones de agua, gas y electricidad. Presupuesto cerrado y un único interlocutor.",
  path: `/${slug}`,
});

export default function ReformasCocinasPage() {
  const service = getService(slug)!;

  const schemas = [
    breadcrumbSchema([
      { label: "Inicio", href: "/" },
      { label: "Reformas de cocinas", href: `/${slug}` },
    ]),
    faqSchema(service.faqs),
  ];

  return <ServicePage service={service} schemas={schemas} />;
}
