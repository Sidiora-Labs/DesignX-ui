import { useMediaQuery } from "./use-media-query";

/** True when the primary input can hover (a mouse or trackpad). */
export function useHoverCapable() {
  return useMediaQuery("(hover: hover) and (pointer: fine)", true);
}
