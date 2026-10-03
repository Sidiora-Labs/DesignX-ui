import { useMediaQuery } from "./use-media-query";

/** True when the primary input is coarse (a finger). */
export function useTouchCapable() {
  return useMediaQuery("(pointer: coarse)", false);
}
