import { useIsPresent } from "motion/react";
import type { CSSProperties, ReactNode } from "react";

export type PresenceGateProps = {
  children: (state: { isPresent: boolean; gate: { style: CSSProperties; "aria-hidden"?: boolean } }) => ReactNode;
};

/**
 * Releases interaction the moment an AnimatePresence child starts exiting,
 * rather than when the exit animation ends. Spread `gate` onto the element.
 */
export function PresenceGate({ children }: PresenceGateProps) {
  const isPresent = useIsPresent();
  const gate = isPresent ? { style: {} } : { style: { pointerEvents: "none" } as CSSProperties, "aria-hidden": true };
  return <>{children({ isPresent, gate })}</>;
}
