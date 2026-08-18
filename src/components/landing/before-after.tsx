"use client";

import Image from "next/image";
import { useCallback, useRef, useState } from "react";

import type { ObraPhoto } from "@/config/photos";
import { cn } from "@/lib/cn";

interface BeforeAfterProps {
  before: ObraPhoto;
  after: ObraPhoto;
  className?: string;
  sizes?: string;
}

const MIN = 2;
const MAX = 98;
const clamp = (v: number) => Math.min(MAX, Math.max(MIN, v));

/**
 * Drag-to-compare before/after view.
 *
 * The "after" photo is the base layer and the "before" photo is clipped on
 * top, so a browser without JS (or before hydration) still shows a legible
 * 50/50 split rather than an empty box. The handle is a real slider input
 * wrapper: pointer drag, arrow keys and Home/End all move it.
 */
export function BeforeAfter({
  before,
  after,
  className,
  sizes = "(min-width: 1024px) 700px, 100vw",
}: BeforeAfterProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const [pct, setPct] = useState(50);
  /**
   * Drag state lives in a ref as well as in state: the ref is what the move
   * handler reads, so a move that arrives in the same tick as the pointerdown
   * is not dropped waiting for React to flush. The state copy only drives the
   * cursor.
   */
  const draggingRef = useRef(false);
  const [dragging, setDragging] = useState(false);

  const setFromClientX = useCallback((clientX: number) => {
    const box = boxRef.current;
    if (!box) return;
    const rect = box.getBoundingClientRect();
    setPct(clamp(((clientX - rect.left) / rect.width) * 100));
  }, []);

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    // Capture keeps the drag alive when the pointer leaves the box. It throws
    // InvalidPointerId if the pointer is already gone, which is not fatal.
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      /* drag still works while the pointer stays over the box */
    }
    draggingRef.current = true;
    setDragging(true);
    setFromClientX(event.clientX);
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (draggingRef.current) setFromClientX(event.clientX);
  };

  const stopDragging = (event: React.PointerEvent<HTMLDivElement>) => {
    try {
      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId);
      }
    } catch {
      /* nothing to release */
    }
    draggingRef.current = false;
    setDragging(false);
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const step = event.shiftKey ? 10 : 2;
    if (event.key === "ArrowLeft") setPct((v) => clamp(v - step));
    else if (event.key === "ArrowRight") setPct((v) => clamp(v + step));
    else if (event.key === "Home") setPct(MIN);
    else if (event.key === "End") setPct(MAX);
    else return;
    event.preventDefault();
  };

  return (
    <div
      ref={boxRef}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDragging}
      onPointerCancel={stopDragging}
      className={cn(
        "relative touch-pan-y select-none overflow-hidden rounded bg-line",
        dragging ? "cursor-grabbing" : "cursor-ew-resize",
        className
      )}
    >
      <Image
        src={after.src}
        alt={after.alt}
        fill
        sizes={sizes}
        className="object-cover"
      />
      <Image
        src={before.src}
        alt={before.alt}
        fill
        sizes={sizes}
        className="object-cover"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      />

      <div
        role="slider"
        tabIndex={0}
        aria-label="Comparar antes y después"
        aria-valuemin={MIN}
        aria-valuemax={MAX}
        aria-valuenow={Math.round(pct)}
        aria-valuetext={`${Math.round(pct)} % de la foto anterior a la reforma`}
        onKeyDown={onKeyDown}
        className="absolute bottom-0 top-0 w-px bg-sand outline-none"
        style={{ left: `${pct}%` }}
      >
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded bg-sand text-xs font-bold text-ink shadow-[0_2px_10px_rgba(21,22,19,0.25)]">
          ↔
        </span>
      </div>

      <span className="pointer-events-none absolute left-4 top-4 rounded bg-ink/70 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-sand md:left-5 md:top-5">
        Antes
      </span>
      <span className="pointer-events-none absolute right-4 top-4 rounded bg-sand/90 px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink md:right-5 md:top-5">
        Después
      </span>
    </div>
  );
}
