import { useEffect, useRef, type RefObject } from "react";

export type DismissOptions = {
  /**
   * "pass" (default) lets the outside press reach whatever it landed on;
   * "consume" swallows the click that follows it.
   */
  behavior?: "pass" | "consume";
  /** Return true for targets that should not count as outside. */
  ignore?: (target: Element) => boolean;
  /** Also dismiss on Escape. Default true. */
  escape?: boolean;
};

/** Calls `onDismiss` on a pointerdown outside `ref` (or anywhere, when ref is null) while `active`. */
export function useDismiss(
  active: boolean,
  onDismiss: () => void,
  ref: RefObject<Element | null> | null,
  { behavior = "pass", ignore, escape = true }: DismissOptions = {},
) {
  const cb = useRef(onDismiss);
  cb.current = onDismiss;
  const ignoreRef = useRef(ignore);
  ignoreRef.current = ignore;

  useEffect(() => {
    if (!active) return;
    const onDown = (event: PointerEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (ref?.current?.contains(target)) return;
      if (ignoreRef.current?.(target)) return;
      if (behavior === "consume") {
        const swallow = (e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
        };
        window.addEventListener("click", swallow, { capture: true, once: true });
        window.setTimeout(() => window.removeEventListener("click", swallow, { capture: true }), 400);
      }
      cb.current();
    };
    const onKey = (event: KeyboardEvent) => {
      if (escape && event.key === "Escape") cb.current();
    };
    document.addEventListener("pointerdown", onDown, true);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown, true);
      document.removeEventListener("keydown", onKey);
    };
  }, [active, behavior, escape, ref]);
}
