import { CtaButton } from "@/components/ui/cta-button";
import { cn } from "@/lib/cn";

type Tone = "sand" | "line" | "ink";

interface CtaCardProps {
  title: string;
  /** Small line under the title. Optional — keep it short or omit it. */
  note?: string;
  href?: string;
  label?: string;
  /** Surface colour. Vary it between sections so the page has rhythm. */
  tone?: Tone;
  className?: string;
}

const TONES: Record<Tone, { surface: string; title: string; note: string }> = {
  sand: { surface: "bg-sand", title: "text-ink", note: "text-ink-soft" },
  line: { surface: "bg-line", title: "text-ink", note: "text-ink/60" },
  ink: { surface: "bg-ink", title: "text-sand", note: "text-sand/60" },
};

/**
 * Full-width call to action on its own surface. The alternative to the inline
 * text-plus-button row, so the same ask does not look identical every time it
 * appears down the page.
 */
export function CtaCard({
  title,
  note,
  href,
  label,
  tone = "line",
  className,
}: CtaCardProps) {
  const t = TONES[tone];

  return (
    <div
      className={cn(
        "flex flex-col justify-between gap-8 rounded-lg p-8 md:flex-row md:items-end md:gap-12 md:p-10",
        t.surface,
        className
      )}
    >
      <div>
        <p
          className={cn(
            "max-w-[26ch] text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.12] tracking-[-0.02em]",
            t.title
          )}
        >
          {title}
        </p>
        {note ? (
          <p className={cn("mt-4 max-w-[46ch] text-sm leading-relaxed", t.note)}>
            {note}
          </p>
        ) : null}
      </div>
      <CtaButton
        href={href}
        label={label}
        variant={tone === "ink" ? "light" : "solid"}
        className="shrink-0"
      />
    </div>
  );
}
