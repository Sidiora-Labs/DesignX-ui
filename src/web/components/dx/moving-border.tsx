import * as React from "react";
import { motion, useAnimationFrame, useMotionTemplate, useMotionValue, useReducedMotion, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * MovingBordera soft light that travels around a rounded rectangle.
 * Wrap any content; the light shows through a thin gap around it.
 */

type MovingBorderProps = React.ComponentProps<"div"> & {
  /** Milliseconds per lap. */
  duration?: number;
  /** Outer corner radius (CSS length). */
  radius?: string;
  /** Gap between the edge and the content, where the light shows. */
  gap?: string;
  /** Light colour. */
  color?: string;
  /** Light diameter in px. */
  size?: number;
  contentClassName?: string;
};

function MovingBorder({
  duration = 3000,
  radius = "1.75rem",
  gap = "1px",
  color = "var(--dx-blue-3)",
  size = 80,
  className,
  contentClassName,
  style,
  children,
  ...props
}: MovingBorderProps) {
  const rect = React.useRef<SVGRectElement>(null);
  const progress = useMotionValue(0);
  const reduce = useReducedMotion();

  useAnimationFrame((time) => {
    if (reduce) return;
    const length = rect.current?.getTotalLength();
    if (length) progress.set(((time / duration) * length) % length);
  });

  const x = useTransform(progress, (v) => rect.current?.getPointAtLength(v).x ?? 0);
  const y = useTransform(progress, (v) => rect.current?.getPointAtLength(v).y ?? 0);
  const transform = useMotionTemplate`translate(${x}px, ${y}px) translate(-50%, -50%)`;

  return (
    <div
      data-slot="moving-border"
      className={cn("relative overflow-hidden", className)}
      style={{ borderRadius: radius, padding: gap, ...style }}
      {...props}
    >
      <div aria-hidden className="absolute inset-0" style={{ borderRadius: radius }}>
        <svg className="absolute size-full" preserveAspectRatio="none" width="100%" height="100%">
          <rect ref={rect} fill="none" width="100%" height="100%" rx="30%" ry="30%" />
        </svg>
        <motion.div
          className="absolute top-0 left-0 rounded-full opacity-80"
          style={{
            transform,
            width: size,
            height: size,
            background: `radial-gradient(${color} 40%, transparent 60%)`,
          }}
        />
      </div>
      <div
        className={cn("relative flex size-full items-center justify-center bg-card", contentClassName)}
        style={{ borderRadius: `calc(${radius} - ${gap})` }}
      >
        {children}
      </div>
    </div>
  );
}

export { MovingBorder };
export type { MovingBorderProps };
