import { siteConfig } from "@/config/site";
import {
  legalBasesSentence,
  legalField,
  processorLines,
  titularLine,
} from "@/lib/legal";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Privacidad",
  description: "Política de privacidad de " + siteConfig.brandName + ".",
  path: "/privacidad",
});

export default function PrivacidadPage() {
  const { legal } = siteConfig;

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight text-ink">
        Política de privacidad
      </h1>

      <div className="mt-8 space-y-6 text-ink-soft">
        <section>
          <h2 className="text-lg font-semibold text-ink">
            Responsable del tratamiento
          </h2>
          <dl className="mt-3 space-y-1.5">
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink">Responsable:</dt>
              <dd>{titularLine()}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink">Domicilio:</dt>
              <dd>{legalField(legal.address)}</dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink">Contacto:</dt>
              <dd>
                <a
                  href={`mailto:${legal.contactEmail}`}
                  className="underline underline-offset-4 hover:text-ink"
                >
                  {legal.contactEmail}
                </a>
              </dd>
            </div>
            <div className="flex flex-wrap gap-x-2">
              <dt className="text-ink">Delegado de protección de datos:</dt>
              <dd>{legalField(legal.dpo, "no designado · pendiente de evaluar")}</dd>
            </div>
          </dl>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Qué datos tratamos</h2>
          <p className="mt-2">
            A través del formulario de presupuesto recogemos: nombre, teléfono y
            email (opcional), junto con los datos necesarios para valorar la
            reforma (tipo de reforma, superficie aproximada, zona y plazo en el
            que quieres empezar).
          </p>
          <p className="mt-2">
            Si aceptas las cookies analíticas, también tratamos datos de
            navegación y el origen de la visita para medir el uso del sitio.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Finalidad</h2>
          <p className="mt-2">
            Atender tu solicitud de presupuesto, contactarte para concretar la
            visita técnica, transmitir la solicitud al proveedor operativo que
            ejecutará la obra y cumplir las obligaciones legales aplicables.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Base legal</h2>
          <p className="mt-2">
            El tratamiento se ampara en {legalBasesSentence()}.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Plazo de conservación</h2>
          <p className="mt-2">
            Con carácter general, {legal.retention.general}. Los datos con
            relevancia fiscal o contable se conservan {legal.retention.accounting},
            conforme a la normativa aplicable.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">
            Destinatarios y encargados del tratamiento
          </h2>
          <p className="mt-2">
            Tus datos se comunican al proveedor operativo que ejecute la obra,
            únicamente para atender tu solicitud. Además intervienen los
            siguientes encargados:
          </p>
          <ul className="mt-3 space-y-2">
            {processorLines().map((line) => (
              <li key={line} className="flex gap-3">
                <span
                  aria-hidden="true"
                  className="mt-2 h-1.5 w-1.5 shrink-0 rotate-45 bg-bronze"
                />
                {line}
              </li>
            ))}
          </ul>
          <p className="mt-3">
            No cedemos tus datos a terceros con fines publicitarios.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Tus derechos</h2>
          <p className="mt-2">
            Puedes ejercer los derechos de acceso, rectificación, supresión,
            oposición, limitación y portabilidad, así como retirar tu
            consentimiento en cualquier momento, escribiendo a{" "}
            <a
              href={`mailto:${legal.contactEmail}`}
              className="underline underline-offset-4 hover:text-ink"
            >
              {legal.contactEmail}
            </a>
            .
          </p>
          <p className="mt-2">
            Si consideras que no hemos atendido correctamente tu solicitud,
            puedes reclamar ante la {legal.authority.name} (
            <a
              href={legal.authority.url}
              rel="noopener"
              className="underline underline-offset-4 hover:text-ink"
            >
              {legal.authority.url.replace("https://", "")}
            </a>
            ).
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Seguridad</h2>
          <p className="mt-2">
            Aplicamos medidas técnicas y organizativas razonables para proteger
            tus datos frente a accesos no autorizados, pérdida o alteración.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Cambios en la política</h2>
          <p className="mt-2">
            Podemos actualizar esta política para adaptarla a cambios legales o
            de funcionamiento del sitio. La versión vigente es siempre la
            publicada en esta página.
          </p>
        </section>
      </div>
    </section>
  );
}
