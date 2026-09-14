/**
 * PROJECTS — the /proyectos page.
 * ====================================================================
 * Each entry is a DIFFERENT completed obra, shown through one room with
 * its real before/after pair. They are not stages of a single dwelling,
 * so nothing here may compare one entry against another ("the smallest
 * room", "the darkest part of the house") or state a single surface or
 * type for the whole set.
 *
 * Every description states only what is visible when you compare the two
 * frames of that obra. Nothing about brands, budgets, timings or trades
 * is claimed.
 *
 * TODO: confirm zona, superficie y fecha for each obra separately, and
 * have someone who was on site review the descriptions.
 * ====================================================================
 */

import { photos, type ObraPhoto } from "@/config/photos";
import { siteConfig } from "@/config/site";

export interface WorkFact {
  label: string;
  value: string;
  /** true → shown in bronze as a review marker, not as a claim. */
  pending?: boolean;
}

export interface Work {
  id: string;
  index: string;
  /** What the pair shows. Never implies a relationship to another entry. */
  name: string;
  scope: string;
  body: string;
  before: ObraPhoto;
  after: ObraPhoto;
}

export const worksPage = {
  eyebrow: "Antes y después",
  title: "Varias de nuestras obras",
  intro:
    "Cada comparación es una obra distinta, con su antes y su después reales de la misma estancia. Arrastra la guía para verlo.",
  cover: photos.salonDespues,
  coverCaption: "Salón y comedor de una de las obras, una vez terminada",

  facts: [
    { label: "Obras", value: "8 documentadas" },
    { label: "Ámbito", value: siteConfig.serviceArea },
    { label: "Comparaciones", value: "Antes y después reales" },
    {
      label: "Datos por obra",
      value: "TODO: confirmar zona, superficie y fecha",
      pending: true,
    },
  ] satisfies WorkFact[],

  works: [
    {
      id: "salon",
      index: "01",
      name: "Salón y comedor",
      scope: "Suelos · paredes · carpintería",
      body: "El terrazo y las paredes oscuras dejan paso a tarima clara y pintura lisa. Se retira el mobiliario fijo que ocupaba el testero y el balcón vuelve a ser la fuente de luz de la estancia.",
      before: photos.salonAntes,
      after: photos.salonDespues,
    },
    {
      id: "cocina",
      index: "02",
      name: "Cocina",
      scope: "Instalaciones · distribución · mobiliario",
      body: "Se rehace por completo. Desaparecen el alicatado de pared a techo y el suelo de barro, y el frente se ordena en una línea continua de encimera con los electrodomésticos integrados. El paso al tendedero queda despejado y acristalado.",
      before: photos.cocinaAntes,
      after: photos.cocinaDespues,
    },
    {
      id: "bano",
      index: "03",
      name: "Baño",
      scope: "Impermeabilización · saneamiento · alicatado",
      body: "Alicatado nuevo hasta media altura sobre el azulejo estampado original, bañera y sanitarios sustituidos y un mueble de lavabo que aporta el almacenaje que antes no había.",
      before: photos.banoAntes,
      after: photos.banoDespues,
    },
    {
      id: "dormitorio",
      index: "04",
      name: "Dormitorio",
      scope: "Carpintería · suelos",
      body: "Se desmonta el armario de obra que ocupaba la pared completa. Con el muro liberado entra una cama nido con almacenaje y una zona de estudio junto a la ventana, sobre suelo laminado.",
      before: photos.dormitorioAntes,
      after: photos.dormitorioDespues,
    },
    {
      id: "dormitorio-individual",
      index: "05",
      name: "Dormitorio individual",
      scope: "Suelos · pintura",
      body: "Sin tocar la superficie: cambian el parqué antiguo, la pintura y el orden del mobiliario para que quepa un escritorio aprovechando la luz de la ventana.",
      before: photos.dormitorio3Antes,
      after: photos.dormitorio3Despues,
    },
    {
      id: "pasillo",
      index: "06",
      name: "Pasillo y distribuidor",
      scope: "Redistribución · carpintería",
      body: "Un distribuidor cerrado por carpintería maciza y sin luz propia. El cerramiento acristalado sustituye a las puertas ciegas y trae hasta él la luz de la zona de día.",
      before: photos.pasilloAntes,
      after: photos.pasilloDespues,
    },
    {
      id: "terraza",
      index: "07",
      name: "Terraza",
      scope: "Cerramiento · incorporación a la zona de día",
      body: "Un tendedero alicatado que deja de ser zona de lavado. Cerrado y terminado, pasa a funcionar como una pieza más de la zona de día, con sitio para una mesa.",
      before: photos.terrazaAntes,
      after: photos.terrazaDespues,
    },
    {
      id: "humedad",
      index: "08",
      name: "Humedad en pared",
      scope: "Saneado · reparación · pintura",
      body: "La pintura y el revoque levantados por la humedad se sanean hasta el soporte y se vuelven a cerrar. La pared queda lisa y pintada, con el rodapié repuesto.",
      before: photos.humedadAntes,
      after: photos.humedadDespues,
    },
  ] satisfies Work[],
};
