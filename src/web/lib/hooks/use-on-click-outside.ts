import { useEffect, useRef, type RefObject } from "react";

/** Calls `handler` on a mousedown/touchstart outside `ref`. */
export function useOnClickOutside<T extends Element>(
  ref: RefObject<T | null>,
  handler: (event: MouseEvent | TouchEvent) => void,
) {
  const cb = useRef(handler);
  cb.current = handler;
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const el = ref.current;
      if (!el || (event.target instanceof Node && el.contains(event.target))) return;
      cb.current(event);
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref]);
}
