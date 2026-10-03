import { useMemo, useRef } from "react";
import type { PointerEvent } from "react";

export type HoverGesture = {
  /** Returns true when the enter is a real hover (not the compatibility event a tap fires). */
  enter: (event: PointerEvent) => boolean;
  /** Returns true when the leave ends a real hover. */
  leave: (event: PointerEvent) => boolean;
};

/**
 * Pairs pointerenter/pointerleave so only genuine hovers count. Touch taps fire
 * enter/leave around the tap itself, which would flicker hover UI open and shut.
 */
export function useHoverGesture(): HoverGesture {
  const hovering = useRef(false);
  return useMemo(
    () => ({
      enter(event) {
        if (event.pointerType === "touch") return false;
        hovering.current = true;
        return true;
      },
      leave(event) {
        if (event.pointerType === "touch" || !hovering.current) return false;
        hovering.current = false;
        return true;
      },
    }),
    [],
  );
}
