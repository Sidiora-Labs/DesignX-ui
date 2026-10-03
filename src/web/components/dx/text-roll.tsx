import * as React from "react";
import { motion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * TextRollon hover every letter rolls up and a copy rolls in from below.
 *
 */

type TextRollProps = {
  children: string;
  /** Stagger outward from the middle letter instead of left to right. */
  center?: boolean;
  /** Seconds between letters. */
  stagger?: number;
  transition?: Transition;
  className?: string;
  /** Roll when this is true, regardless of hover (e.g. driven by a parent). */
  active?: boolean;
};

const DEFAULT_TRANSITION: Transition = { duration: 0.45, ease: [0.2, 0, 0, 1] };

function TextRoll({ children, center = false, stagger = 0.035, transition = DEFAULT_TRANSITION, className, active }: TextRollProps) {
  const letters = React.useMemo(() => Array.from(children), [children]);
  const delayOf = (i: number) => (center ? stagger * Math.abs(i - (letters.length - 1) / 2) : stagger * i);
  const controlled = active !== undefined;

  const row = (from: string | number, to: string | number, hidden?: boolean) =>
    letters.map((l, i) => (
      <motion.span
        key={i}
        aria-hidden={hidden}
        variants={{ initial: { y: from }, hovered: { y: to } }}
        transition={{ ...transition, delay: delayOf(i) }}
        className="inline-block whitespace-pre"
      >
        {l}
      </motion.span>
    ));

  return (
    <motion.span
      data-slot="text-roll"
      initial="initial"
      animate={controlled ? (active ? "hovered" : "initial") : undefined}
      whileHover={controlled ? undefined : "hovered"}
      aria-label={children}
      className={cn("relative inline-block overflow-hidden leading-[0.85]", className)}
    >
      <span aria-hidden className="block">
        {row(0, "-100%", true)}
      </span>
      <span aria-hidden className="absolute inset-0 block">
        {row("100%", 0, true)}
      </span>
    </motion.span>
  );
}

export { TextRoll };
export type { TextRollProps };
