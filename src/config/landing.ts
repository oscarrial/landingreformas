/**
 * LANDING — centralized content for the high-conversion home page.
 * Every number, project, service, testimonial or area is configurable here.
 * Values we cannot verify are placeholders clearly marked as TODO.
 */

import type { StaticImageData } from "next/image";

import { photos, type ObraPhoto } from "@/config/photos";

/**
 * Hero — full-bleed photo with the headline laid over it.
 * The caption still carries the design's review note; see `TODO` markers.
 */
export const hero = {
  photo: photos.salonDespues,
  support:
    "Proyecto, presupuesto y un único responsable desde la primera visita hasta la entrega de llaves.",
  cta: "Solicitar valoración",
  caption: "Reforma integral · Madrid · TODO: identificar proyecto y superficie",
};

/** Five-step summary of the process, shown in the home bento block. */
export const processSummary = [
  { number: "01", label: "Visita técnica y toma de datos" },
  { number: "02", label: "Alcance y presupuesto por partidas" },
  { number: "03", label: "Planificación de fases y proveedores" },
  { number: "04", label: "Ejecución con seguimiento semanal" },
  { number: "05", label: "Entrega, documentación y repasos" },
];

export interface TrustBarItem {
  /** Large figure. Omit for non-numeric claims. */
  lead?: string;
  suffix?: string;
  label: string;
}

/** Trust bar — only includes claims we can actually back. */
export const trustBar: TrustBarItem[] = [
  { lead: "15", suffix: "+", label: "años de experiencia" }, // real (provider)
  { lead: "1", suffix: "", label: "único responsable de tu obra" },
  { label: "Presupuesto detallado por partidas" },
  { label: "Madrid y alrededores" },
];

/** Hero trust signals (below the CTAs). Only confirmed, honest promises. */
export const heroTrustSignals = [
  "Presupuesto detallado",
  "Planificación de obra",
  "Gestión integral",
  "Un único responsable",
];

export interface LandingProject {
  title: string;
  type: string;
  area: string;
  /** Neighbourhood. `null` until confirmed — never invented. */
  zone: string | null;
  /** Surface, e.g. "92 m²". `null` until confirmed. */
  sizeM2: string | null;
  /**
   * Review marker rendered in place of the unconfirmed zone/m². Set to `null`
   * once `zone` and `sizeM2` hold real values — it must not ship to users.
   */
  pendingNote: string | null;
  image: StaticImageData;
  imageAlt: string;
  /** Route to the project detail (or /proyectos while pages are pending). */
  href: string;
  todo: boolean;
}

/**
 * Projects — real photography from a completed reforma. Titles describe what
 * is visible in each frame.
 * TODO: confirm zone, m² and date for this project; add further projects.
 */
export const landingProjects: LandingProject[] = [
  {
    title: "Terraza incorporada a la zona de día",
    type: "Reforma integral",
    area: "Madrid",
    zone: null,
    sizeM2: null,
    pendingNote: "TODO: zona · m²",
    image: photos.terrazaDespues.src,
    imageAlt: photos.terrazaDespues.alt,
    href: "/proyectos",
    todo: true,
  },
  {
    title: "Pasillo y cocina redistribuidos para ganar luz",
    type: "Reforma integral",
    area: "Madrid",
    zone: null,
    sizeM2: null,
    pendingNote: "TODO: zona · m²",
    image: photos.pasilloDespues.src,
    imageAlt: photos.pasilloDespues.alt,
    href: "/proyectos",
    todo: true,
  },
  {
    title: "Dormitorios renovados sin tocar la estructura",
    type: "Reforma parcial",
    area: "Madrid",
    zone: null,
    sizeM2: null,
    pendingNote: "TODO: zona · m²",
    image: photos.dormitorio3Despues.src,
    imageAlt: photos.dormitorio3Despues.alt,
    href: "/proyectos",
    todo: true,
  },
];

/** Featured before/after comparison (draggable slider on the home page). */
export const beforeAfter = {
  title: "El cambio se entiende al verlo.",
  before: photos.salonAntes,
  after: photos.salonDespues,
  context: "Arrastra la guía para comparar. Obra real ejecutada en Madrid.",
  /** Review marker — clear this once the obra data is confirmed. */
  pendingNote: "TODO: confirmar zona, superficie y fecha.",
};

export interface BeforeAfterPair {
  label: string;
  before: ObraPhoto;
  after: ObraPhoto;
}

/** Secondary before/after pairs shown as small side-by-side thumbnails. */
export const beforeAfterPairs: BeforeAfterPair[] = [
  {
    label: "Cocina · instalaciones y distribución",
    before: photos.cocinaAntes,
    after: photos.cocinaDespues,
  },
  {
    label: "Baño · impermeabilización y saneamiento",
    before: photos.banoAntes,
    after: photos.banoDespues,
  },
  {
    label: "Dormitorio · carpintería y suelos",
    before: photos.dormitorioAntes,
    after: photos.dormitorioDespues,
  },
];

/** Pain points — editorial, not cards. Risk-oriented copy. */
export const painPoints = [
  {
    number: "01",
    title: "Presupuesto claro",
    body: "Definimos partidas y alcance antes de empezar para reducir desviaciones y decisiones improvisadas.",
  },
  {
    number: "02",
    title: "Planificación",
    body: "Cada fase se organiza antes de comenzar la obra.",
  },
  {
    number: "03",
    title: "Un único responsable",
    body: "No tendrás que coordinar personalmente a cada gremio.",
  },
  {
    number: "04",
    title: "Gestión integral",
    body: "Centralizamos proyecto, proveedores, obra y documentación.",
  },
];

export interface LandingService {
  number: string;
  name: string;
  description: string;
  photo: ObraPhoto;
  href: string;
  /** true → no dedicated page yet; linked to /presupuesto. */
  pending: boolean;
}

export const landingServices: LandingService[] = [
  {
    number: "01",
    name: "Reformas integrales",
    description: "Toda la vivienda, de la primera visita a la entrega.",
    photo: photos.salonDespues,
    href: "/reformas-integrales-madrid",
    pending: false,
  },
  {
    number: "02",
    name: "Cocinas",
    description: "Agua, electricidad y extracción resueltas antes que la estética.",
    photo: photos.cocinaDespues,
    href: "/reformas-cocinas-madrid",
    pending: false,
  },
  {
    number: "03",
    name: "Baños",
    description: "Impermeabilización y saneamiento que no dan problemas después.",
    photo: photos.banoDespues,
    href: "/reformas-banos-madrid",
    pending: false,
  },
  {
    number: "04",
    name: "Pisos",
    description:
      "Redistribución y actualización de instalaciones en edificios existentes.",
    photo: photos.pasilloDespues,
    href: "/reformas-pisos-madrid",
    pending: false,
  },
  {
    number: "05",
    name: "Humedades",
    description:
      "Diagnóstico y tratamiento de filtraciones, capilaridad y condensación.",
    photo: photos.humedadAntes,
    href: "/reformas-humedades-madrid",
    pending: false,
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  reformType: string;
  zone: string;
  stars: number;
  placeholder: boolean;
}

/**
 * Testimonials — PLACEHOLDERS. We never attribute reviews to real people.
 * TODO: replace with verified client reviews. The first one is displayed
 * large; the rest as secondary quotes.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Texto de ejemplo: la coordinación de la obra nos tranquilizó desde el primer día y el presupuesto se ajustó a lo firmado. TODO: sustituir por una reseña real verificada.",
    name: "Cliente · Chamberí",
    reformType: "Reforma integral",
    zone: "Madrid",
    stars: 5,
    placeholder: true,
  },
  {
    quote:
      "Texto de ejemplo: un único responsable resolvía cualquier duda sin necesidad de perseguir a nadie. TODO: sustituir por una reseña real verificada.",
    name: "Cliente · Pozuelo",
    reformType: "Cocina + baños",
    zone: "Madrid",
    stars: 5,
    placeholder: true,
  },
  {
    quote:
      "Texto de ejemplo: la entrega fue en plazo y se nos informó de cada fase. TODO: sustituir por una reseña real verificada.",
    name: "Cliente · Barrio de Salamanca",
    reformType: "Reforma integral",
    zone: "Madrid",
    stars: 5,
    placeholder: true,
  },
];

/** Team members — only real people with real credentials. Empty = hidden. */
export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  photo: string;
  photoAlt: string;
}

export const teamMembers: TeamMember[] = [];
// TODO: add real team members (name, role, qualification, photo) when available.

/**
 * Zones — no dedicated pages yet. Rendered as text (no dead links).
 * TODO: create one page per zone only when there is real content to serve.
 */
export const areas = [
  "Madrid Centro",
  "Chamberí",
  "Barrio de Salamanca",
  "Chamartín",
  "Retiro",
  "Moncloa-Aravaca",
  "Pozuelo de Alarcón",
  "Majadahonda",
  "Las Rozas",
  "Boadilla del Monte",
];
