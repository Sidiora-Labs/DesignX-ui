import { motion, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * TextShimmera highlight that sweeps across text, for "thinking",
 * "generating" and other in-progress moments. Colors follow the theme.
 */

type TextShimmerProps = {
  children: string;
  as?: "p" | "span" | "div" | "h1" | "h2" | "h3";
  className?: string;
  /** Seconds per sweep. */
  duration?: number;
  /** Highlight width, multiplied by the text length (px per character). */
  spread?: number;
  /** Base text color. */
  baseColor?: string;
  /** Highlight color. */
  shimmerColor?: string;
};

const MotionTags = {
  p: motion.p,
  span: motion.span,
  div: motion.div,
  h1: motion.h1,
  h2: motion.h2,
  h3: motion.h3,
};

function TextShimmer({
  children,
  as = "span",
  className,
  duration = 2,
  spread = 2,
  baseColor = "color-mix(in srgb, var(--foreground) 42%, transparent)",
  shimmerColor = "var(--foreground)",
}: TextShimmerProps) {
  const reduce = useReducedMotion();
  const Tag = MotionTags[as];
  const width = Math.max(children.length * spread, 24);
  return (
    <Tag
      data-slot="text-shimmer"
      className={cn("relative inline-block bg-clip-text text-transparent [background-repeat:no-repeat,padding-box]", className)}
      initial={{ backgroundPosition: "100% center" }}
      animate={reduce ? undefined : { backgroundPosition: "0% center" }}
      transition={{ repeat: Infinity, duration, ease: "linear" }}
      style={{
        backgroundSize: "250% 100%, auto",
        backgroundImage: `linear-gradient(90deg, transparent calc(50% - ${width}px), ${shimmerColor}, transparent calc(50% + ${width}px)), linear-gradient(${baseColor}, ${baseColor})`,
      }}
    >
      {children}
    </Tag>
  );
}

export { TextShimmer };
export type { TextShimmerProps };
