import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * GlowBordera rotating DX gradient halo that hugs its parent's edge.
 * Place inside a `relative` element.
 */

const blurs = {
  none: "after:blur-none",
  sm: "after:blur-sm",
  md: "after:blur-md",
  lg: "after:blur-lg",
  xl: "after:blur-xl",
  "2xl": "after:blur-2xl",
} as const;

const DEFAULT_COLORS = ["var(--dx-blue-3)", "var(--dx-purple-3)", "var(--dx-pink-3)", "var(--dx-yellow-3)"];

type GlowBorderProps = {
  active?: boolean;
  /** How soft the inner edge is. */
  intensity?: keyof typeof blurs;
  /** Border thickness in px. */
  thickness?: number;
  /** Seconds per full rotation. */
  duration?: number;
  colors?: string[];
  className?: string;
};

function GlowBorder({
  active = true,
  intensity = "lg",
  thickness = 2,
  duration = 5,
  colors = DEFAULT_COLORS,
  className,
}: GlowBorderProps) {
  const stops = colors.join(", ");
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          data-slot="glow-border"
          aria-hidden
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          animate={{
            opacity: 1,
            background: [`linear-gradient(0deg, ${stops})`, `linear-gradient(360deg, ${stops})`],
          }}
          transition={{ opacity: { duration: 0.5, ease: "easeInOut" }, duration, repeat: Infinity, ease: "linear" }}
          style={{ "--glow-inset": `${thickness}px` } as React.CSSProperties}
          className={cn(
            "pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]",
            "after:bg-background after:absolute after:inset-[var(--glow-inset)] after:rounded-[inherit] after:content-['']",
            blurs[intensity],
            className,
          )}
        />
      )}
    </AnimatePresence>
  );
}

export { GlowBorder };
export type { GlowBorderProps };
