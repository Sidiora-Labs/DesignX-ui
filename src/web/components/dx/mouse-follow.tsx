import * as React from "react";
import { motion, useMotionValue, useSpring, type SpringOptions } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * MouseFollowa region with a custom cursor that tracks the pointer, either
 * 1:1 or on a spring.
 */

const DEFAULT_SPRING: SpringOptions = { mass: 0.1, damping: 10, stiffness: 131 };

type MouseFollowProps = Omit<React.ComponentProps<"div">, "onPointerMove" | "onPointerEnter" | "onPointerLeave"> & {
  /** Follow on a spring (true) or exactly (false). */
  spring?: boolean | SpringOptions;
  /** The follower. Defaults to a dot. */
  cursor?: React.ReactNode;
  /** Diameter of the default dot in px. */
  size?: number;
  /** Hide the native cursor inside the region. */
  hideCursor?: boolean;
  cursorClassName?: string;
};

function MouseFollow({
  spring = true,
  cursor,
  size = 20,
  hideCursor = false,
  className,
  cursorClassName,
  children,
  ...props
}: MouseFollowProps) {
  const opts = spring === true ? DEFAULT_SPRING : spring || { stiffness: 100000, damping: 1000, mass: 0.001 };
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const sx = useSpring(rawX, opts);
  const sy = useSpring(rawY, opts);
  const presence = useSpring(0, spring ? opts : { stiffness: 600, damping: 40 });
  const x = spring ? sx : rawX;
  const y = spring ? sy : rawY;

  return (
    <div
      data-slot="mouse-follow"
      className={cn("relative overflow-hidden", hideCursor && "cursor-none", className)}
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        rawX.set(e.clientX - r.left);
        rawY.set(e.clientY - r.top);
      }}
      onPointerEnter={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        rawX.jump(e.clientX - r.left);
        rawY.jump(e.clientY - r.top);
        sx.jump(e.clientX - r.left);
        sy.jump(e.clientY - r.top);
        presence.set(1);
      }}
      onPointerLeave={() => presence.set(0)}
      {...props}
    >
      {children}
      <motion.div
        aria-hidden
        data-slot="mouse-follow-cursor"
        style={{ x, y, opacity: presence, scale: presence, translateX: "-50%", translateY: "-50%" }}
        className={cn("pointer-events-none absolute top-0 left-0 z-10", cursorClassName)}
      >
        {cursor ?? <div style={{ width: size, height: size }} className="rounded-full bg-foreground/80" />}
      </motion.div>
    </div>
  );
}

export { MouseFollow };
export type { MouseFollowProps };
