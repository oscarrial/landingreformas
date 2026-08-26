import type { ReactNode } from "react";

type Block =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] };

function toBlocks(content: string): Block[] {
  return content
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
    .map((chunk): Block => {
      const lines = chunk.split("\n");
      if (chunk.startsWith("## ")) {
        return { type: "h2", text: chunk.replace(/^##\s+/, "") };
      }
      if (lines.every((line) => line.startsWith("- "))) {
        return {
          type: "ul",
          items: lines.map((line) => line.replace(/^-\s+/, "")),
        };
      }
      return { type: "p", text: chunk };
    });
}

function renderBlock(block: Block, i: number): ReactNode {
  switch (block.type) {
    case "h2":
      return (
        <h2
          key={i}
          className="mt-12 font-display text-2xl leading-tight tracking-[-0.015em] text-ink"
        >
          {block.text}
        </h2>
      );
    case "ul":
      return (
        <ul key={i} className="mt-6 space-y-3">
          {block.items.map((item) => (
            <li key={item} className="flex gap-3 text-ink">
              <span
                aria-hidden="true"
                className="mt-2.5 h-1.5 w-1.5 shrink-0 rotate-45 bg-bronze"
              />
              {item}
            </li>
          ))}
        </ul>
      );
    case "p":
    default:
      return (
        <p key={i} className="mt-6 text-[17px] leading-[1.7] text-ink-soft">
          {block.text}
        </p>
      );
  }
}

/** Renders the lightweight blog markup: paragraphs, "## " headings, "- " lists. */
export function PostContent({ content }: { content: string }) {
  return (
    <div className="max-w-[720px]">
      {toBlocks(content).map(renderBlock)}
    </div>
  );
}