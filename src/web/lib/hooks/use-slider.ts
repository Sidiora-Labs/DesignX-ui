import { useCallback, useRef, useState, type KeyboardEvent, type PointerEvent, type RefObject } from "react";

import { capturePointer, releasePointer } from "@/lib/touch";

export type SliderOptions = {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Fires when a drag or key press settles. */
  onValueCommit?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  "aria-label"?: string;
  "aria-labelledby"?: string;
  /** Screen-reader text for the current value. */
  formatValueText?: (value: number) => string;
};

const decimalsOf = (n: number) => String(n).split(".")[1]?.length ?? 0;

/** Clamp `value` to [min, max] and snap it to the nearest step from min. */
export function snapSliderValue(value: number, min: number, max: number, step: number) {
  if (!(step > 0)) return Math.min(max, Math.max(min, value));
  const steps = Math.round((value - min) / step);
  let next = min + steps * step;
  if (next > max) next = min + Math.floor(Number(((max - min) / step).toFixed(6))) * step;
  // max is always reachable, even when the step does not divide the range.
  if (Math.abs(max - value) < Math.abs(next - value)) next = max;
  next = Math.min(max, Math.max(min, next));
  return Number(next.toFixed(Math.max(decimalsOf(step), decimalsOf(min))));
}

/**
 * Headless single-thumb slider: controlled or uncontrolled value, pointer
 * dragging on a track, and the full ARIA slider keyboard model.
 */
export function useSlider({
  value,
  defaultValue,
  onValueChange,
  onValueCommit,
  min = 0,
  max = 100,
  step = 1,
  disabled = false,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  formatValueText,
}: SliderOptions) {
  const safeStep = step > 0 ? step : 1;
  const [inner, setInner] = useState(() => snapSliderValue(defaultValue ?? min, min, max, safeStep));
  const current = value ?? inner;
  const [dragging, setDragging] = useState(false);
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>;
  const latest = useRef(current);
  latest.current = current;

  const commit = useCallback(
    (raw: number) => {
      const next = snapSliderValue(raw, min, max, safeStep);
      if (next === latest.current) return next;
      latest.current = next;
      if (value === undefined) setInner(next);
      onValueChange?.(next);
      return next;
    },
    [min, max, safeStep, value, onValueChange],
  );

  const fromPointer = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return latest.current;
    const t = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    return min + t * (max - min);
  };

  const pointerId = useRef<number | null>(null);

  const trackProps = {
    ref,
    onPointerDown: (event: PointerEvent<HTMLElement>) => {
      if (disabled || event.button !== 0) return;
      event.preventDefault();
      pointerId.current = event.pointerId;
      capturePointer(event.currentTarget, event.pointerId);
      setDragging(true);
      commit(fromPointer(event.clientX));
      event.currentTarget.querySelector<HTMLElement>("[role=slider]")?.focus({ preventScroll: true });
    },
    onPointerMove: (event: PointerEvent<HTMLElement>) => {
      if (pointerId.current !== event.pointerId) return;
      commit(fromPointer(event.clientX));
    },
    onPointerUp: (event: PointerEvent<HTMLElement>) => {
      if (pointerId.current !== event.pointerId) return;
      pointerId.current = null;
      releasePointer(event.currentTarget, event.pointerId);
      setDragging(false);
      onValueCommit?.(latest.current);
    },
    onPointerCancel: (event: PointerEvent<HTMLElement>) => {
      if (pointerId.current !== event.pointerId) return;
      pointerId.current = null;
      setDragging(false);
    },
  };

  const sliderProps = {
    role: "slider" as const,
    tabIndex: disabled ? -1 : 0,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    "aria-valuemin": min,
    "aria-valuemax": max,
    "aria-valuenow": current,
    "aria-valuetext": formatValueText ? formatValueText(current) : undefined,
    "aria-orientation": "horizontal" as const,
    "aria-disabled": disabled || undefined,
    onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
      if (disabled) return;
      const big = Math.max(safeStep, (max - min) / 10);
      const map: Record<string, number> = {
        ArrowRight: current + safeStep,
        ArrowUp: current + safeStep,
        ArrowLeft: current - safeStep,
        ArrowDown: current - safeStep,
        PageUp: current + big,
        PageDown: current - big,
        Home: min,
        End: max,
      };
      if (!(event.key in map)) return;
      event.preventDefault();
      onValueCommit?.(commit(map[event.key]));
    },
  };

  const percent = max === min ? 0 : ((current - min) / (max - min)) * 100;

  return { current, percent, dragging, min, max, step: safeStep, commit, trackProps, sliderProps };
}
