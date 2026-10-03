import { useMemo, useRef } from "react";
import type { PointerEvent } from "react";

export type TapGesture<T> = { pointerType: string; state: T };

/**
 * Remembers the pointer that started a press and some state captured at that
 * moment, so the following click can tell a tap from a mouse click and read
 * the state as it was before focus/hover handlers changed it.
 */
export function useTapGesture<T>() {
  const ref = useRef<TapGesture<T> | null>(null);
  return useMemo(
    () => ({
      start(event: PointerEvent, state: T) {
        ref.current = { pointerType: event.pointerType, state };
      },
      /** Read and clear the pending gesture. `null` for keyboard clicks. */
      take(): TapGesture<T> | null {
        const g = ref.current;
        ref.current = null;
        return g;
      },
      drop() {
        ref.current = null;
      },
    }),
    [],
  );
}
