import { siteConfig } from "@/config/site";
import { CONSENT_COOKIE, CONSENT_MAX_AGE_MONTHS } from "@/lib/consent";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Política de cookies",
  description: "Política de cookies de " + siteConfig.brandName + ".",
  path: "/cookies",
});

interface CookieRow {
  name: string;
  provider: string;
  purpose: string;
  duration: string;
}

/** Only cookies this site actually sets. Keep in sync with what loads. */
const TECHNICAL: CookieRow[] = [
  {
    name: CONSENT_COOKIE,
    provider: siteConfig.legal.tradeName,
    purpose: "Guardar tu decisión sobre las cookies no necesarias",
    duration: `${CONSENT_MAX_AGE_MONTHS} meses`,
  },
];

const ANALYTICS: CookieRow[] = [
  {
    name: "_ga",
    provider: "Google Analytics 4",
    purpose: "Identificar usuarios únicos de forma anónima",
    duration: "13 meses",
  },
  {
    name: "_ga_*",
    provider: "Google Analytics 4",
    purpose: "Persistencia del estado de sesión",
    duration: "13 meses",
  },
];

function CookieTable({ rows }: { rows: CookieRow[] }) {
  return (
    <div className="mt-4 overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="border-b border-line text-[11px] uppercase tracking-[0.14em] text-ink-soft">
            <th className="py-2 pr-4 font-semibold">Cookie</th>
            <th className="py-2 pr-4 font-semibold">Proveedor</th>
            <th className="py-2 pr-4 font-semibold">Finalidad</th>
            <th className="py-2 font-semibold">Duración</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className="border-b border-line-soft align-top">
              <td className="py-3 pr-4 font-medium text-ink">
                <code className="text-[13px]">{row.name}</code>
              </td>
              <td className="py-3 pr-4">{row.provider}</td>
              <td className="py-3 pr-4">{row.purpose}</td>
              <td className="py-3 whitespace-nowrap">{row.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiesPage() {
  const adsEnabled = Boolean(siteConfig.analytics.adsId);

  return (
    <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-display text-4xl tracking-tight text-ink">
        Política de cookies
      </h1>

      <div className="mt-8 space-y-8 text-ink-soft">
        <section>
          <h2 className="text-lg font-semibold text-ink">Qué son las cookies</h2>
          <p className="mt-2">
            Las cookies son pequeños archivos que se guardan en tu dispositivo
            para que el sitio funcione o para medir su uso.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">
            Técnicas y de personalización (siempre activas)
          </h2>
          <p className="mt-2">
            Necesarias para que el sitio funcione. No requieren consentimiento.
          </p>
          <CookieTable rows={TECHNICAL} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">
            Analíticas (solo con tu consentimiento)
          </h2>
          <p className="mt-2">
            No se cargan hasta que las aceptas. El encargado del tratamiento es
            Google Ireland Ltd.
          </p>
          <CookieTable rows={ANALYTICS} />
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">
            Marketing (solo con tu consentimiento)
          </h2>
          <p className="mt-2">
            {adsEnabled
              ? "Permiten medir campañas y anuncios. Solo se cargan si las aceptas."
              : "El panel de cookies permite aceptar esta categoría, pero actualmente no hay ninguna herramienta de marketing activa en el sitio, así que no se instala ninguna cookie de esta categoría."}
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">
            Cómo gestionar las cookies
          </h2>
          <p className="mt-2">
            Puedes aceptar todas, rechazarlas o configurar tus preferencias desde
            el panel que aparece al entrar en el sitio. Tu decisión se guarda en
            la cookie <code className="text-[13px]">{CONSENT_COOKIE}</code> y
            puedes cambiarla borrándola desde la configuración de tu navegador.
          </p>
          <p className="mt-2">
            Para cualquier duda:{" "}
            <a
              href={`mailto:${siteConfig.legal.contactEmail}`}
              className="underline underline-offset-4 hover:text-ink"
            >
              {siteConfig.legal.contactEmail}
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-ink">Cambios en la política</h2>
          <p className="mt-2">
            Podemos actualizar esta política si cambian las herramientas del
            sitio. La versión vigente es siempre la publicada en esta página.
          </p>
        </section>
      </div>
    </section>
  );
}
