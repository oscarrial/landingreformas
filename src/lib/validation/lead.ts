import { z } from "zod";

/**
 * Lead validation (server-side).
 * Fields match the 5-step lead-qualifier wizard.
 */

export const reformTypeSchema = z.enum([
  "vivienda_completa",
  "piso",
  "cocina",
  "bano",
  "humedades",
  "chalet",
  "otro",
]);
export type ReformType = z.infer<typeof reformTypeSchema>;

/** Location area (Madrid area options). */
export const areaSchema = z.enum([
  "madrid",
  "pozuelo",
  "majadahonda",
  "las_rozas",
  "boadilla",
  "otro",
]);
export type Area = z.infer<typeof areaSchema>;

export const startTimeframeSchema = z.enum([
  "lo_antes_posible",
  "1_3_meses",
  "3_6_meses",
  "mas_adelante",
]);
export type StartTimeframe = z.infer<typeof startTimeframeSchema>;

/** Approximate surface in m². Null when the user does not know. */
const sizeM2Schema = z
  .union([
    z.number().int().min(10).max(1000),
    z.null(),
  ])
  .optional()
  .default(null);

/** Spanish phone: digits/spaces/+, 9–15 chars total. Lenient by design. */
const phoneSchema = z
  .string()
  .trim()
  .regex(
    /^\+?[0-9][0-9\s]{8,14}$/,
    "Indica un teléfono válido para poder contactarte"
  );

/**
 * Attribution values arrive as a string, "" or null: `buildLeadAttribution()`
 * emits null for every parameter the visit did not carry. Rejecting null here
 * made the API 400 on every real submission, so null must be accepted.
 */
const urlOrNull = z
  .union([z.string().trim().max(2000), z.literal(""), z.null()])
  .transform((v) => (v ? v : null));

/** Attribution fields, all optional and sanitized to a max length. */
const attributionSchema = z.object({
  landing_page: urlOrNull,
  referrer: urlOrNull,
  utm_source: urlOrNull,
  utm_medium: urlOrNull,
  utm_campaign: urlOrNull,
  utm_term: urlOrNull,
  utm_content: urlOrNull,
  gclid: urlOrNull,
  gbraid: urlOrNull,
  wbraid: urlOrNull,
  fbclid: urlOrNull,
  msclkid: urlOrNull,
  first_touch_source: urlOrNull,
  first_touch_landing: urlOrNull,
  last_touch_source: urlOrNull,
  last_touch_landing: urlOrNull,
});

export const leadSchema = z.object({
  reform_type: reformTypeSchema,
  size_m2: sizeM2Schema,
  area: areaSchema,
  start_timeframe: startTimeframeSchema,

  name: z.string().trim().min(2, "Escribe tu nombre").max(120),
  phone: phoneSchema,
  email: z
    .union([z.string().trim().email("Email no válido"), z.literal("")])
    .transform((v) => (v ? v : null)),

  /** Legal consent checkbox — must be explicitly true. */
  consent: z.literal(true, "Necesitamos tu consentimiento para contactarte"),

  /** Honeypot: any value means a bot. Validation passes (bot sees success);
   *  the route drops it silently. */
  website: z.string().max(200).optional().default(""),

  attribution: attributionSchema
    .partial()
    .optional()
    .default({})
    // Fields the payload did not carry are `undefined` after `partial()`;
    // postgres.js rejects undefined values (UNDEFINED_VALUE). Normalize to
    // null before they reach the DB layer.
    .transform((a) => {
      const out: Record<string, string | null> = {};
      for (const key of Object.keys(attributionSchema.shape)) {
        out[key] = a[key as keyof typeof a] ?? null;
      }
      return out;
    }),

  /** Lead id passed from a previous attempt (idempotency, optional). */
  client_lead_id: z
    .union([z.string().trim().max(40), z.literal("")])
    .optional()
    .transform((v) => (v ? v : null)),
});

export type LeadPayload = z.infer<typeof leadSchema>;

export type NormalizedLeadPayload = z.infer<typeof leadSchema>;
