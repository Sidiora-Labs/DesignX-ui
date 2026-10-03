import * as React from "react";
import { AnimatePresence, motion, type Transition } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * useLoop + TextLoopa ticking key for cycling content, and a text slot that
 * rolls through a list.
 */

/** Returns a `key` that increments every `delay` ms. Pass `paused` to stop the clock. */
function useLoop(delay = 1000, paused = false) {
  const [key, setKey] = React.useState(0);
  React.useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setKey((k) => k + 1), delay);
    return () => window.clearInterval(id);
  }, [delay, paused]);
  return { key, reset: () => setKey(0) };
}

type TextLoopProps = {
  items: React.ReactNode[];
  /** ms each item stays on screen. */
  interval?: number;
  paused?: boolean;
  direction?: "up" | "down";
  transition?: Transition;
  className?: string;
};

function TextLoop({ items, interval = 2000, paused, direction = "up", transition, className }: TextLoopProps) {
  const { key } = useLoop(interval, paused);
  const sign = direction === "up" ? 1 : -1;
  return (
    <span data-slot="text-loop" className={cn("relative inline-flex overflow-hidden align-bottom", className)}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={key}
          initial={{ opacity: 0, y: `${100 * sign}%`, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: `${-100 * sign}%`, filter: "blur(4px)" }}
          transition={transition ?? { type: "spring", stiffness: 300, damping: 30 }}
          className="inline-block whitespace-nowrap"
        >
          {items[key % items.length]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export { TextLoop, useLoop };
export type { TextLoopProps };
