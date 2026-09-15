"use client";

import { useEffect, useId, useRef, useState } from "react";

import { buildLeadAttribution } from "@/lib/attribution/client";
import {
  trackFormStart,
  trackFormError,
  trackFormStepComplete,
  trackGenerateLead,
} from "@/lib/analytics/client";
import { cn } from "@/lib/cn";

export type ReformType =
  | "vivienda_completa"
  | "piso"
  | "cocina"
  | "bano"
  | "humedades"
  | "chalet"
  | "otro";
type Area = "madrid" | "pozuelo" | "majadahonda" | "las_rozas" | "boadilla" | "otro";
type StartTimeframe = "lo_antes_posible" | "1_3_meses" | "3_6_meses" | "mas_adelante";

interface FormState {
  reformType: ReformType | "";
  sizeM2: number | null;
  sizeUnknown: boolean;
  area: Area | "";
  startTimeframe: StartTimeframe | "";
  name: string;
  phone: string;
  email: string;
  consent: boolean;
}

const initialState: FormState = {
  reformType: "",
  sizeM2: 80,
  sizeUnknown: false,
  area: "",
  startTimeframe: "",
  name: "",
  phone: "",
  email: "",
  consent: false,
};

const REFORM_OPTIONS: { value: ReformType; label: string }[] = [
  { value: "vivienda_completa", label: "Vivienda completa" },
  { value: "piso", label: "Piso" },
  { value: "cocina", label: "Cocina" },
  { value: "bano", label: "Baño" },
  { value: "humedades", label: "Humedades" },
  { value: "chalet", label: "Chalet" },
  { value: "otro", label: "Otro" },
];

const AREA_OPTIONS: { value: Area; label: string }[] = [
  { value: "madrid", label: "Madrid capital" },
  { value: "pozuelo", label: "Pozuelo" },
  { value: "majadahonda", label: "Majadahonda" },
  { value: "las_rozas", label: "Las Rozas" },
  { value: "boadilla", label: "Boadilla" },
  { value: "otro", label: "Otro" },
];

const TIMEFRAME_OPTIONS: { value: StartTimeframe; label: string }[] = [
  { value: "lo_antes_posible", label: "Lo antes posible" },
  { value: "1_3_meses", label: "En 1–3 meses" },
  { value: "3_6_meses", label: "En 3–6 meses" },
  { value: "mas_adelante", label: "Más adelante" },
];

type Status = "idle" | "submitting" | "success" | "error";

const STEP_COUNT = 5;

export interface LeadFormProps {
  /**
   * Pre-selects what the visitor wants to reform and skips that question.
   * Used on the service pages, where the answer is already implied.
   */
  defaultReformType?: ReformType;
}

export function LeadForm({ defaultReformType }: LeadFormProps = {}) {
  // With defaultReformType the first question is already answered.
  const firstStep = defaultReformType ? 1 : 0;
  const [step, setStep] = useState(firstStep);
  const [form, setForm] = useState<FormState>(() =>
    defaultReformType
      ? { ...initialState, reformType: defaultReformType }
      : initialState
  );
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({});
  const [status, setStatus] = useState<Status>("idle");
  const [serverMessage, setServerMessage] = useState("");
  const [leadId, setLeadId] = useState<string | null>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const hasFiredStart = useRef(false);
  /**
   * The step whose heading we have already focused. Seeded with the initial
   * step so mounting never moves focus — and, unlike a "first render" flag,
   * it stays correct when StrictMode double-invokes the mount effect.
   */
  const focusedStep = useRef(firstStep);

  /**
   * Field ids are namespaced per instance: the form can be embedded on a page
   * that already has another copy of it, and duplicate ids would silently
   * break every label/input association.
   */
  const uid = useId();
  const fieldId = (name: string) => `${name}${uid}`;

  useEffect(() => {
    // Only move focus when the visitor advances a step. Focusing on mount
    // would yank the page down to an embedded form on load.
    if (focusedStep.current === step) return;
    focusedStep.current = step;
    headingRef.current?.focus();
  }, [step]);

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    // form_start means "the visitor engaged", not "the form rendered".
    if (!hasFiredStart.current) {
      hasFiredStart.current = true;
      trackFormStart();
    }
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const validateStep = (s: number): boolean => {
    const next: Partial<Record<keyof FormState, string>> = {};
    if (s === 0 && !form.reformType) next.reformType = "Elige qué quieres reformar";
    if (s === 1 && !form.sizeUnknown && (form.sizeM2 === null || form.sizeM2 < 10))
      next.sizeM2 = "Indica una superficie aproximada";
    if (s === 2 && !form.area) next.area = "Elige la zona de la vivienda";
    if (s === 3 && !form.startTimeframe) next.startTimeframe = "Elige cuándo quieres empezar";
    if (s === 4) {
      if (form.name.trim().length < 2) next.name = "Escribe tu nombre";
      if (!/^\+?[0-9][0-9\s]{8,14}$/.test(form.phone.trim()))
        next.phone = "Indica un teléfono válido";
      if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
        next.email = "Revisa el email";
      if (!form.consent)
        next.consent = "Necesitamos tu consentimiento para contactarte";
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const focusFirstError = (s: number) => {
    const selectors: Record<number, string> = {
      0: 'input[name="reform_type"]',
      1: 'input[name="size_m2"]',
      2: 'input[name="area"]',
      3: 'input[name="start_timeframe"]',
      4: 'input[name="name"]',
    };
    const selector = selectors[s];
    if (!selector) return;
    requestAnimationFrame(() => {
      // Scoped to this form: a document-wide query would focus another
      // instance's field when two forms share a page.
      formRef.current?.querySelector<HTMLElement>(selector)?.focus();
    });
  };

  const next = () => {
    if (validateStep(step)) {
      setStep((s) => s + 1);
      trackFormStepComplete(step + 1);
    } else {
      focusFirstError(step);
    }
  };

  const back = () => setStep((s) => Math.max(firstStep, s - 1));

  const submit = async () => {
    if (!validateStep(4)) {
      focusFirstError(4);
      return;
    }
    setStatus("submitting");
    setServerMessage("");

    const att = buildLeadAttribution();
    const attribution = {
      landing_page: att.current_source.landing_page,
      referrer: att.current_source.referrer,
      utm_source: att.current_source.utm_source,
      utm_medium: att.current_source.utm_medium,
      utm_campaign: att.current_source.utm_campaign,
      utm_term: att.current_source.utm_term,
      utm_content: att.current_source.utm_content,
      gclid: att.current_source.gclid,
      gbraid: att.current_source.gbraid,
      wbraid: att.current_source.wbraid,
      fbclid: att.current_source.fbclid,
      msclkid: att.current_source.msclkid,
      first_touch_source: att.first_touch?.source ?? null,
      first_touch_landing: att.first_touch?.landing_page ?? null,
      last_touch_source: att.last_touch?.source ?? null,
      last_touch_landing: att.last_touch?.landing_page ?? null,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reform_type: form.reformType,
          size_m2: form.sizeUnknown ? null : form.sizeM2,
          area: form.area,
          start_timeframe: form.startTimeframe,
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim() || "",
          consent: form.consent,
          website: "",
          attribution,
        }),
      });

      const data = (await res.json()) as { ok?: boolean; lead_id?: string; message?: string };

      if (!res.ok || !data.ok) {
        throw new Error(data.message ?? "No pudimos enviar tu solicitud. Inténtalo de nuevo.");
      }

      setLeadId(data.lead_id ?? null);
      setStatus("success");
      // generate_lead fires ONLY after the server confirmed the lead.
      trackGenerateLead(data.lead_id);
    } catch (err) {
      setServerMessage(
        err instanceof Error ? err.message : "No pudimos enviar tu solicitud."
      );
      setStatus("error");
      trackFormError("server");
    }
  };

  const visibleSteps = STEP_COUNT - firstStep;
  const progress = (step - firstStep + 1) / visibleSteps;

  if (status === "success") {
    return (
      <div className="rounded-[0.25rem] border border-line bg-sand p-8 text-center">
        <p className="section-marker mb-4 justify-center">Recibido</p>
        <h3 className="font-display text-3xl text-ink">
          Gracias, {form.name.split(" ")[0]}.
        </h3>
        <p className="mx-auto mt-3 max-w-md text-ink-soft">
          Con estos datos ya podemos entender mejor tu proyecto. Te
          contactaremos para preparar una valoración personalizada
          {leadId ? ` (referencia ${leadId})` : ""}.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-[0.25rem] border border-line bg-sand p-2 shadow-[0_1px_0_rgba(245,242,236,0.6)_inset]">
      <div className="rounded-[0.125rem] border border-line-soft bg-paper p-6 sm:p-8">
        {/* Progress — counted over the steps this instance actually asks. */}
        <div className="mb-6">
          <div className="flex items-center justify-between text-xs font-medium uppercase tracking-[0.14em] text-ink-soft">
            <span>
              Paso {step - firstStep + 1} de {visibleSteps}
            </span>
            <span aria-hidden="true">{Math.round(progress * 100)}%</span>
          </div>
          <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-bronze transition-all duration-300"
              style={{ width: `${progress * 100}%` }}
            />
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={(e) => {
            e.preventDefault();
            if (step < STEP_COUNT - 1) next();
            else void submit();
          }}
          noValidate
        >
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="text-balance font-display text-2xl text-ink outline-none"
          >
            {stepTitles[step]}
          </h3>

          {/* Honeypot */}
          <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor={fieldId("website")}>No rellenar</label>
            <input
              id={fieldId("website")}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value=""
              onChange={() => undefined}
            />
          </div>

          <div className="mt-6 min-h-[16rem]">
            {step === 0 && (
              <ChoiceGrid
                name="reform_type"
                options={REFORM_OPTIONS}
                value={form.reformType}
                onChange={(v) => update("reformType", v as ReformType)}
                error={errors.reformType}
              />
            )}

            {step === 1 && (
              <SizeField
                id={fieldId("size_m2")}
                value={form.sizeM2}
                unknown={form.sizeUnknown}
                onChange={(v) => update("sizeM2", v)}
                onUnknownChange={(v) => update("sizeUnknown", v)}
                error={errors.sizeM2}
              />
            )}

            {step === 2 && (
              <ChoiceGrid
                name="area"
                options={AREA_OPTIONS}
                value={form.area}
                onChange={(v) => update("area", v as Area)}
                error={errors.area}
              />
            )}

            {step === 3 && (
              <ChoiceGrid
                name="start_timeframe"
                options={TIMEFRAME_OPTIONS}
                value={form.startTimeframe}
                onChange={(v) => update("startTimeframe", v as StartTimeframe)}
                error={errors.startTimeframe}
              />
            )}

            {step === 4 && (
              <ContactFields
                form={form}
                errors={errors}
                update={update}
                fieldId={fieldId}
              />
            )}
          </div>

          {serverMessage && status === "error" ? (
            <p role="alert" className="mt-4 rounded-[0.125rem] border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-800">
              {serverMessage}
            </p>
          ) : null}

          <div className="mt-8 flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={back}
              disabled={step === 0 || status === "submitting"}
              className="inline-flex items-center gap-1 rounded-[0.125rem] px-3 py-3 text-sm font-semibold text-ink-soft transition-opacity hover:text-ink disabled:opacity-40"
            >
              <span aria-hidden="true">←</span> Atrás
            </button>

            <button
              type="submit"
              disabled={status === "submitting"}
              className="btn-primary min-w-44 justify-center px-6 py-3.5 text-base disabled:cursor-not-allowed disabled:opacity-70"
            >
              {status === "submitting" ? (
                <>
                  <Spinner />
                  Enviando…
                </>
              ) : step === STEP_COUNT - 1 ? (
                "Solicitar valoración"
              ) : (
                "Continuar"
              )}
            </button>
          </div>

          <p className="mt-4 text-xs leading-relaxed text-ink-soft">
            Presupuesto sin compromiso. Solo usamos tus datos para atender tu
            solicitud. Consulta la política de privacidad.
          </p>
        </form>
      </div>
    </div>
  );
}

const stepTitles = [
  "¿Qué quieres reformar?",
  "¿Cuántos metros tiene aproximadamente?",
  "¿Dónde está la vivienda?",
  "¿Cuándo quieres empezar?",
  "¿Cómo te contactamos?",
];

function Spinner() {
  return (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.3" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" />
    </svg>
  );
}

interface ChoiceGridProps<T extends string> {
  name: string;
  options: { value: T; label: string }[];
  value: T | "";
  onChange: (value: T) => void;
  error?: string;
}

function ChoiceGrid<T extends string>({ name, options, value, onChange, error }: ChoiceGridProps<T>) {
  return (
    <fieldset>
      <legend className="sr-only">{name}</legend>
      <div className="grid gap-3 sm:grid-cols-2">
        {options.map((opt) => {
          const checked = value === opt.value;
          return (
            <label
              key={opt.value}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-[0.125rem] border px-4 py-3.5 transition-colors",
                checked
                  ? "border-bronze-deep bg-sand"
                  : "border-line bg-white hover:border-bronze"
              )}
            >
              <input
                type="radio"
                name={name}
                value={opt.value}
                checked={checked}
                onChange={() => onChange(opt.value)}
                className="h-4 w-4 shrink-0 accent-bronze-deep"
              />
              <span className="text-base text-ink">{opt.label}</span>
            </label>
          );
        })}
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

function SizeField({
  id,
  value,
  unknown,
  onChange,
  onUnknownChange,
  error,
}: {
  id: string;
  value: number | null;
  unknown: boolean;
  onChange: (v: number) => void;
  onUnknownChange: (v: boolean) => void;
  error?: string;
}) {
  const sliderValue = value ?? 80;
  return (
    <div>
      <div className="flex items-end justify-between">
        <p className="text-sm text-ink-soft">Superficie aproximada de la vivienda</p>
        <p className="font-display text-2xl text-ink" aria-live="polite">
          {unknown ? "No lo sé" : `${sliderValue} m²`}
        </p>
      </div>
      <input
        id={id}
        name="size_m2"
        type="range"
        min={20}
        max={300}
        step={5}
        value={sliderValue}
        disabled={unknown}
        onChange={(e) => onChange(Number(e.target.value))}
        aria-label="Superficie en metros cuadrados"
        aria-valuetext={unknown ? "No lo sé" : `${sliderValue} m²`}
        className="mt-5 w-full accent-bronze-deep disabled:opacity-40"
      />
      <div className="mt-1 flex justify-between text-xs text-ink-soft" aria-hidden="true">
        <span>20 m²</span>
        <span>300 m²</span>
      </div>

      <label className="mt-5 flex w-fit cursor-pointer items-center gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={unknown}
          onChange={(e) => onUnknownChange(e.target.checked)}
          className="h-4 w-4 accent-bronze-deep"
        />
        No sé los metros exactos
      </label>

      {error ? (
        <p role="alert" className="mt-3 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ContactFields({
  form,
  errors,
  update,
  fieldId,
}: {
  form: FormState;
  errors: Partial<Record<keyof FormState, string>>;
  update: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  fieldId: (name: string) => string;
}) {
  return (
    <div className="space-y-5">
      <TextInput label="Nombre" name="name" id={fieldId("name")} autoComplete="name" placeholder="Tu nombre" value={form.name} onChange={(v) => update("name", v)} error={errors.name} />
      <TextInput label="Teléfono" name="phone" id={fieldId("phone")} inputMode="tel" autoComplete="tel" placeholder="600 000 000" value={form.phone} onChange={(v) => update("phone", v)} error={errors.phone} />
      <TextInput
        label="Email (opcional)"
        name="email"
        id={fieldId("email")}
        inputMode="email"
        autoComplete="email"
        placeholder="tucorreo@ejemplo.es"
        value={form.email}
        onChange={(v) => update("email", v)}
        error={errors.email}
        spellCheck={false}
      />

      <label className="flex items-start gap-3 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={form.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 accent-bronze-deep"
          aria-invalid={Boolean(errors.consent)}
        />
        <span>
          He leído y acepto la política de privacidad y consiento el tratamiento de mis
          datos para que nos pongamos en contacto en relación con esta solicitud.
        </span>
      </label>
      {errors.consent ? (
        <p role="alert" className="text-sm font-medium text-red-700">
          {errors.consent}
        </p>
      ) : null}
    </div>
  );
}

function TextInput({
  label,
  name,
  id,
  placeholder,
  value,
  onChange,
  error,
  inputMode,
  autoComplete,
  spellCheck,
}: {
  label: string;
  name: string;
  id: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  inputMode?: "numeric" | "text" | "email" | "tel";
  autoComplete?: string;
  spellCheck?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-base font-medium text-ink">
        {label}
      </label>
      <input
        id={id}
        name={name}
        type="text"
        inputMode={inputMode}
        autoComplete={autoComplete}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={spellCheck}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className="mt-2 w-full rounded-[0.125rem] border border-line bg-white px-4 py-3.5 text-base text-ink placeholder:text-ink-soft/60 focus:border-bronze-deep focus:outline-none"
      />
      {error ? (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      ) : null}
    </div>
  );
}
