import { getService } from "@/config/services";
import { ServicePage } from "@/components/service-page";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, faqSchema } from "@/lib/seo/schema";

const slug = "reformas-banos-madrid";

export const metadata = buildMetadata({
  title: "Reformas de baños en Madrid",
  description:
    "Reforma de baños en Madrid con impermeabilización y saneamiento bien resueltos. Presupuesto cerrado y un único interlocutor.",
  path: `/${slug}`,
});

export default function ReformasBanosPage() {
  const service = getService(slug)!;

  const schemas = [
    breadcrumbSchema([
      { label: "Inicio", href: "/" },
      { label: "Reformas de baños", href: `/${slug}` },
    ]),
    faqSchema(service.faqs),
  ];

  return <ServicePage service={service} schemas={schemas} />;
}
