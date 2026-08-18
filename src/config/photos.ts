/**
 * OBRA PHOTOGRAPHY
 * ====================================================================
 * Real photos, one file per before/after frame, under `src/assets/obra/`
 * (1448x1086 originals).
 *
 * These come from SEVERAL DIFFERENT obras — they are not rooms of one
 * dwelling. Never write copy that compares one pair against another or
 * that treats the set as a single project. Every caption here describes
 * only what is visible in its own frame; no zone, surface or date is
 * attached until confirmed.
 *
 * TODO: confirm zone, m² and completion date per obra.
 * ====================================================================
 */

import type { StaticImageData } from "next/image";

import banoAntes from "@/assets/obra/bano-antes.png";
import banoDespues from "@/assets/obra/bano-despues.png";
import cocinaAntes from "@/assets/obra/cocina-antes.png";
import cocinaDespues from "@/assets/obra/cocina-despues.png";
import dormitorioAntes from "@/assets/obra/dormitorio-antes.png";
import dormitorioDespues from "@/assets/obra/dormitorio-despues.png";
import dormitorio3Antes from "@/assets/obra/dormitorio3-antes.png";
import dormitorio3Despues from "@/assets/obra/dormitorio3-despues.png";
import pasilloAntes from "@/assets/obra/pasillo-antes.png";
import pasilloDespues from "@/assets/obra/pasillo-despues.png";
import salonAntes from "@/assets/obra/salon-antes.png";
import salonDespues from "@/assets/obra/salon-despues.png";
import terrazaAntes from "@/assets/obra/terraza-antes.png";
import terrazaDespues from "@/assets/obra/terraza-despues.png";

export interface ObraPhoto {
  src: StaticImageData;
  alt: string;
}

export const photos = {
  salonAntes: {
    src: salonAntes,
    alt: "Salón comedor antes de la reforma, con suelo de terrazo y paredes oscuras",
  },
  salonDespues: {
    src: salonDespues,
    alt: "Salón comedor después de la reforma, con suelo de madera y paredes claras",
  },
  cocinaAntes: {
    src: cocinaAntes,
    alt: "Cocina antes de la reforma, alicatada de pared a techo y con suelo de barro",
  },
  cocinaDespues: {
    src: cocinaDespues,
    alt: "Cocina después de la reforma, con mobiliario blanco, encimera continua y salida al tendedero",
  },
  banoAntes: {
    src: banoAntes,
    alt: "Baño antes de la reforma, con azulejo estampado y bañera original",
  },
  banoDespues: {
    src: banoDespues,
    alt: "Baño después de la reforma, con alicatado blanco, mueble de lavabo y bañera nueva",
  },
  dormitorioAntes: {
    src: dormitorioAntes,
    alt: "Dormitorio antes de la reforma, con armario de obra en madera y suelo de baldosa",
  },
  dormitorioDespues: {
    src: dormitorioDespues,
    alt: "Dormitorio después de la reforma, con suelo laminado, cama nido y zona de estudio",
  },
  dormitorio3Antes: {
    src: dormitorio3Antes,
    alt: "Dormitorio individual antes de la reforma, con suelo de parqué antiguo",
  },
  dormitorio3Despues: {
    src: dormitorio3Despues,
    alt: "Dormitorio individual después de la reforma, con escritorio junto a la ventana",
  },
  pasilloAntes: {
    src: pasilloAntes,
    alt: "Pasillo antes de la reforma, con carpintería oscura y poca luz natural",
  },
  pasilloDespues: {
    src: pasilloDespues,
    alt: "Pasillo después de la reforma, con cerramiento acristalado que lleva la luz al interior",
  },
  terrazaAntes: {
    src: terrazaAntes,
    alt: "Tendedero antes de la reforma, alicatado y usado como zona de lavadora",
  },
  terrazaDespues: {
    src: terrazaDespues,
    alt: "Terraza después de la reforma, cerrada e incorporada a la zona de día",
  },
} satisfies Record<string, ObraPhoto>;
