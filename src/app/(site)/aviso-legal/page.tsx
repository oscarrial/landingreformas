import { siteConfig } from "@/config/site";
import { legalField, titularLine } from "@/lib/legal";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Aviso legal",
  description: "Aviso legal de " + siteConfig.brandName + ".",
  path: "/aviso-legal",
});

export default function AvisoLegalPage() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight text-ink">
        Aviso legal
      </h1>

      <div className="mt-8 space-y-6 text-ink-soft">
        <section>
          <h2 className="text-lg font-semibold text-ink">Datos identificativos</h2>
          <dl className="mt-3 space-y-1.5">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink">Titular:</dt>
              <dd>{titularLine()}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink">Domicilio:</dt>
              <dd>{legalField(siteConfig.legal.address)}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink">Correo electrónico:</dt>
              <dd>
                <a
                  href={`mailto:${siteConfig.legal.contactEmail}`}
                  className="underline underline-offset-4 hover:text-ink"
                >
                  {siteConfig.legal.contactEmail}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink">Grupo:</dt>
              <dd>
                <a
                  href={siteConfig.legal.groupSite}
                  className="underline underline-offset-4 hover:text-ink"
                  rel="noopener"
                >
                  {siteConfig.legal.tradeName}
                </a>
              </dd>
            </div>
          </dl>
          <p className="mt-4">
            {siteConfig.brandName} es una marca de captación de solicitudes de
            reforma en {siteConfig.serviceArea} operada por{" "}
            {siteConfig.legal.tradeName}.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Objeto</h2>
          <p className="mt-2">
            El objeto de este sitio es ofrecer información sobre reformas en{" "}
            {siteConfig.serviceArea} y permitir la solicitud de presupuestos. La
            ejecución de las obras corre a cargo del proveedor operativo que se
            informe en cada caso.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Propiedad intelectual</h2>
          <p className="mt-2">
            Los contenidos, marcas y elementos gráficos de este sitio pertenecen
            a {siteConfig.legalCompany}, salvo que se indique lo contrario. Queda
            prohibida su reproducción sin autorización.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Responsabilidad</h2>
          <p className="mt-2">
            La información publicada tiene carácter orientativo y no sustituye
            asesoramiento profesional. Los presupuestos se confirman por escrito
            tras la valoración de cada proyecto.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">
            Legislación y jurisdicción
          </h2>
          <p className="mt-2">
            Esta relación se rige por la legislación española. Para cualquier
            controversia serán competentes los juzgados y tribunales que
            correspondan conforme a la normativa aplicable.
          </p>
        </section>
      </div>
    </section>
  );
}
