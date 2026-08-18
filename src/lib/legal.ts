import { siteConfig } from "@/config/site";

/**
 * Renders a legal identification field. Anything the group has not published
 * yet must read as pending, never as a plausible-looking value: an invented
 * razón social or NIF in an aviso legal is a liability, not a placeholder.
 */
export function legalField(value: string | null, pendingLabel = "pendiente"): string {
  return value ?? pendingLabel;
}

/** "Intelia, S.L. (NIF B00000000)" — or the honest pending version. */
export function titularLine(): string {
  const { tradeName, companyName, nif } = siteConfig.legal;
  const name = companyName ?? `${tradeName} · razón social pendiente`;
  return nif ? `${name} (NIF ${nif})` : `${name} · NIF pendiente`;
}

/** Processors listed with the still-unconfirmed ones marked as such. */
export function processorLines(): string[] {
  return siteConfig.legal.processors.map((p) =>
    p.name ? `${p.name} — ${p.purpose}` : `${p.purpose} — proveedor por confirmar`
  );
}

/** "tu consentimiento (art. 6.1.a RGPD), la ejecución… y el cumplimiento…" */
export function legalBasesSentence(): string {
  const parts = siteConfig.legal.legalBases.map(
    (b) => `${b.label} (${b.article})`
  );
  if (parts.length < 2) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} y ${parts[parts.length - 1]}`;
}
