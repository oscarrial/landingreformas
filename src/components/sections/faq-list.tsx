"use client";

import { useState } from "react";

import type { FaqItem } from "@/config/services";
import { cn } from "@/lib/cn";

interface FaqListProps {
  items: FaqItem[];
}

export function FaqList({ items }: FaqListProps) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((faq, i) => (
        <FaqRow key={faq.question} item={faq} defaultOpen={i === 0} />
      ))}
    </div>
  );
}

function FaqRow({
  item,
  defaultOpen,
}: {
  item: FaqItem;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  const panelId = `faq-panel-${slugify(item.question)}`;
  const buttonId = `faq-button-${slugify(item.question)}`;

  return (
    <div>
      <h3>
        <button
          id={buttonId}
          type="button"
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full items-center justify-between gap-6 py-6 text-left transition-colors hover:text-bronze-deep"
          onClick={() => setOpen((v) => !v)}
        >
          <span className="font-display text-lg text-ink sm:text-xl">
            {item.question}
          </span>
          <span
            aria-hidden="true"
            className={cn(
              "grid h-7 w-7 shrink-0 place-items-center rounded-[0.125rem] border border-line font-display text-xl text-bronze-deep transition-transform duration-300",
              open && "rotate-45"
            )}
          >
            +
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        role="region"
        aria-labelledby={buttonId}
        aria-hidden={!open}
        className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="max-w-prose pb-6 leading-relaxed text-ink-soft">
            {item.answer}
          </p>
        </div>
      </div>
    </div>
  );
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}
