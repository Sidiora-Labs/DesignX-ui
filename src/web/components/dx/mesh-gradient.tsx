import * as React from "react";
import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * MeshGradienta slow, drifting mesh of blurred color fields. Pure CSS +
 * motion, no WebGL. Use behind hero sections and AI surfaces.
 */

const DEFAULT_COLORS = ["var(--dx-blue-2)", "var(--dx-blue-3)", "var(--dx-purple-2)", "var(--dx-pink-1)"];

// Each blob drifts between these anchor points (percent of the container).
const PATHS = [
  { x: [-10, 30, 5, -10], y: [-20, 10, 35, -20] },
  { x: [55, 20, 60, 55], y: [-10, 25, 40, -10] },
  { x: [10, 50, 25, 10], y: [50, 30, 0, 50] },
  { x: [60, 35, 70, 60], y: [45, 60, 15, 45] },
  { x: [25, 60, 0, 25], y: [15, 50, 60, 15] },
];

type MeshGradientProps = React.ComponentProps<"div"> & {
  colors?: string[];
  /** Seconds per full drift cycle. Lower is faster. */
  duration?: number;
  /** Blur radius in px. */
  blur?: number;
  /** Add a faint film grain. */
  grain?: boolean;
};

function MeshGradient({ colors = DEFAULT_COLORS, duration = 18, blur = 64, grain = false, className, style, children, ...props }: MeshGradientProps) {
  const reduce = useReducedMotion();
  return (
    <div
      data-slot="mesh-gradient"
      className={cn("relative isolate overflow-hidden", className)}
      style={{ background: colors[colors.length - 1], ...style }}
      {...props}
    >
      <div aria-hidden className="absolute inset-0 -z-10" style={{ filter: `blur(${blur}px)` }}>
        {colors.map((color, i) => {
          const p = PATHS[i % PATHS.length];
          return (
            <motion.div
              key={`${color}-${i}`}
              className="absolute size-[70%] rounded-full mix-blend-normal"
              style={{ background: color, left: `${p.x[0]}%`, top: `${p.y[0]}%` }}
              animate={reduce ? undefined : { left: p.x.map((v) => `${v}%`), top: p.y.map((v) => `${v}%`), scale: [1, 1.15, 0.9, 1] }}
              transition={{ duration: duration + i * 2, repeat: Infinity, ease: "easeInOut" }}
            />
          );
        })}
      </div>
      {grain && (
        <svg aria-hidden className="pointer-events-none absolute inset-0 -z-10 size-full opacity-[0.12] mix-blend-overlay">
          <filter id="dx-mesh-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#dx-mesh-grain)" />
        </svg>
      )}
      {children}
    </div>
  );
}

export { MeshGradient };
export type { MeshGradientProps };
