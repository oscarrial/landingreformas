import { siteConfig } from "@/config/site";
import { LeadForm } from "@/components/lead-form";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata = buildMetadata({
  title: "Solicita tu presupuesto",
  description:
    "Cuéntanos qué quieres reformar en Madrid y recibe una valoración sin compromiso. Presupuesto cerrado y un único interlocutor durante toda la obra.",
  path: "/presupuesto",
});

export default function PresupuestoPage() {
  return (
    <section className="border-b border-line bg-paper py-14 lg:py-20">
      <div className="mx-auto grid max-w-6xl gap-12 px-4 sm:px-6 lg:grid-cols-12">
        <div className="order-last lg:order-none lg:col-span-6">
          <h1 className="text-balance font-display text-4xl leading-[1.1] tracking-[-0.02em] text-ink sm:text-5xl">
            Solicita tu presupuesto de reforma
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft">
            Cuanto más concreto seas, más precisa será la valoración. En unos
            minutos tienes tu solicitud registrada.
          </p>

          <ol className="mt-10 space-y-4 border-t border-line pt-8">
            {[
              "Te contactamos para valorar el alcance.",
              "Si procede, concertamos una visita.",
              "Recibes un presupuesto cerrado por escrito.",
            ].map((item, i) => (
              <li key={item} className="flex gap-4">
                <span className="font-display text-lg text-bronze">
                  0{i + 1}
                </span>
                <span className="text-ink-soft">{item}</span>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-sm text-ink-soft">
            {siteConfig.serviceArea} · Sin compromiso.
          </p>
        </div>

        <div
          id="formulario"
          tabIndex={-1}
          className="order-first scroll-mt-20 outline-none lg:order-none lg:col-span-6"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze lg:hidden">
            Formulario de presupuesto
          </p>
          <LeadForm />
        </div>
      </div>
    </section>
  );
}
