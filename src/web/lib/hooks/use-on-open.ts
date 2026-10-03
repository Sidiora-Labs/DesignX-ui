import { useEffect, useRef } from "react";

/** Runs `callback` each time `open` flips from false to true. */
export function useOnOpen(open: boolean, callback: () => void) {
  const cb = useRef(callback);
  cb.current = callback;
  const prev = useRef(false);
  useEffect(() => {
    if (open && !prev.current) cb.current();
    prev.current = open;
  }, [open]);
}
