import { LeadForm, type LeadFormProps } from "@/components/lead-form";
import { heroTrustSignals } from "@/config/landing";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/cn";

interface LeadFormSectionProps extends LeadFormProps {
  /** Anchor target. Defaults to "presupuesto" so /#presupuesto always works. */
  id?: string;
  eyebrow?: string;
  title: string;
  body?: string;
  /** Adds the top hairline. Off when the previous section already has one. */
  bordered?: boolean;
}

/**
 * The lead form in its page context. Every public page ends on one of these:
 * this is a lead-capture site, so the form is the content, not a destination
 * behind a button.
 */
export function LeadFormSection({
  id = "presupuesto",
  eyebrow = "Presupuesto",
  title,
  body,
  bordered = true,
  defaultReformType,
}: LeadFormSectionProps) {
  return (
    <section
      id={id}
      // tabIndex + scroll-mt: CtaButton focuses this section after scrolling,
      // and the sticky 64px header must not sit over the heading.
      tabIndex={-1}
      className={cn(
        "scroll-mt-20 outline-none",
        bordered && "border-t border-line"
      )}
      aria-labelledby={`${id}-title`}
    >
      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-5 py-24 md:px-10 lg:grid-cols-[1fr_minmax(0,620px)] lg:gap-20 lg:py-30">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-bronze">
            {eyebrow}
          </p>
          <h2
            id={`${id}-title`}
            className="mt-5 max-w-[18ch] text-[clamp(2rem,4.5vw,3.25rem)] leading-[1.02] tracking-[-0.025em]"
          >
            {title}
          </h2>
          {body ? (
            <p className="mt-6 max-w-[44ch] text-[15px] leading-[1.65] text-ink-soft">
              {body}
            </p>
          ) : null}

          <ul className="mt-10 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {heroTrustSignals.map((signal) => (
              <li
                key={signal}
                className="flex items-start gap-2.5 text-sm text-ink-soft"
              >
                <span aria-hidden="true" className="mt-1.5 text-bronze">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path
                      d="M1 5.5 3.5 8 9 2"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                {signal}
              </li>
            ))}
          </ul>

          <p className="mt-8 text-[11px] uppercase tracking-[0.16em] text-ink-soft">
            {siteConfig.serviceArea}
          </p>
        </div>

        <LeadForm defaultReformType={defaultReformType} />
      </div>
    </section>
  );
}
