/**
 * Display labels for lead form values, shared by the form, the lead email
 * and the admin panel so they can never drift apart.
 */

export const REFORM_TYPE_LABELS: Record<string, string> = {
  vivienda_completa: "Vivienda completa",
  piso: "Piso",
  cocina: "Cocina",
  bano: "Baño",
  chalet: "Chalet",
  humedades: "Humedades",
  otro: "Otro",
};

export function reformTypeLabel(value: string): string {
  return REFORM_TYPE_LABELS[value] ?? value;
}

export const AREA_LABELS: Record<string, string> = {
  madrid: "Madrid capital",
  pozuelo: "Pozuelo",
  majadahonda: "Majadahonda",
  las_rozas: "Las Rozas",
  boadilla: "Boadilla",
  otro: "Otro",
};

export function areaLabel(value: string | null): string {
  if (!value) return "—";
  return AREA_LABELS[value] ?? value;
}

export const TIMEFRAME_LABELS: Record<string, string> = {
  lo_antes_posible: "Lo antes posible",
  "1_3_meses": "En 1–3 meses",
  "3_6_meses": "En 3–6 meses",
  mas_adelante: "Más adelante",
};

export function timeframeLabel(value: string): string {
  return TIMEFRAME_LABELS[value] ?? value;
}
