import { Landing } from "@/components/landing/landing";

import { buildMetadata } from "@/lib/seo/metadata";
import {
  faqSchema,
  organizationSchema,
  serviceSchema,
  websiteSchema,
} from "@/lib/seo/schema";
import { homeFaqs } from "@/config/content";

export const metadata = buildMetadata({
  title: "Reformas Integrales en Madrid",
  description:
    "Reformas integrales en Madrid con presupuesto detallado y un único responsable. Solicita tu valoración gratuita sin compromiso.",
  path: "/",
});

export default function LandingPage() {
  const schemas = [
    organizationSchema(),
    websiteSchema(),
    serviceSchema(
      "Reformas integrales",
      "Reformas integrales de viviendas en Madrid: proyecto, presupuesto detallado y un único responsable desde la primera visita hasta la entrega."
    ),
    faqSchema(homeFaqs),
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas) }}
      />
      <Landing />
    </>
  );
}
