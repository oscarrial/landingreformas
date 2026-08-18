import { cn } from "@/lib/cn";

interface SectionMarkerProps {
  children: React.ReactNode;
  className?: string;
}

/** Editorial "plan annotation" label, e.g. "A — Alcance". */
export function SectionMarker({ children, className }: SectionMarkerProps) {
  return <p className={cn("section-marker", className)}>{children}</p>;
}
