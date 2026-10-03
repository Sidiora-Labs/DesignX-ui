import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * InfiniteCanvasan endless, pannable wall of media. Wheel, trackpad,
 * drag or arrow keys move it in any direction; the grid tiles 2×2 and wraps
 * so it never runs out. Motion eases out with a soft spring.
 */

type InfiniteCanvasProps = Omit<React.ComponentProps<"section">, "children"> & {
  /** Anything to tileimages, cards, video. */
  items: React.ReactNode[];
  columns?: number;
  /** Gap between items (CSS length). */
  gap?: string;
  /** Padding around each tile (CSS length). Keep it half the gap for even spacing. */
  padding?: string;
  itemClassName?: string;
  /** Drag multiplier. */
  dragSpeed?: number;
};

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return r === 0 ? v : ((((v - min) % r) + r) % r) + min;
};

function InfiniteCanvas({
  items,
  columns = 5,
  gap = "6rem",
  padding,
  itemClassName = "w-40",
  dragSpeed = 1.5,
  className,
  ...props
}: InfiniteCanvasProps) {
  const section = React.useRef<HTMLElement>(null);
  const tile = React.useRef<HTMLDivElement>(null);
  const [size, setSize] = React.useState({ w: 0, h: 0 });
  const reduce = useReducedMotion();

  const tx = useMotionValue(0);
  const ty = useMotionValue(0);
  const spring = reduce ? { duration: 0 } : { stiffness: 90, damping: 22, mass: 0.6 };
  const sx = useSpring(tx, spring);
  const sy = useSpring(ty, spring);
  const x = useTransform(sx, (v) => (size.w ? wrap(-size.w, 0, v) : v));
  const y = useTransform(sy, (v) => (size.h ? wrap(-size.h, 0, v) : v));

  React.useLayoutEffect(() => {
    const el = tile.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSize({ w: el.offsetWidth, h: el.offsetHeight }));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Wheel needs a non-passive listener to stop the page from scrolling.
  React.useEffect(() => {
    const el = section.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      tx.set(tx.get() - e.deltaX);
      ty.set(ty.get() - e.deltaY);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [tx, ty]);

  const drag = React.useRef<{ x: number; y: number } | null>(null);

  const tileGrid = (dup: boolean, i: number) => (
    <div
      key={i}
      ref={i === 0 ? tile : undefined}
      aria-hidden={dup || undefined}
      className="grid w-max"
      style={{ gridTemplateColumns: `repeat(${columns}, auto)`, gap, padding: padding ?? `calc(${gap} / 2)` }}
    >
      {items.map((item, j) => (
        <div key={j} className={cn("select-none", itemClassName)}>
          {item}
        </div>
      ))}
    </div>
  );

  return (
    // oxlint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <section
      ref={section}
      data-slot="infinite-canvas"
      // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex
      tabIndex={0}
      aria-roledescription="canvas"
      aria-label={props["aria-label"] ?? "Pannable gallery. Drag, scroll or use the arrow keys."}
      onPointerDown={(e) => {
        drag.current = { x: e.clientX, y: e.clientY };
        e.currentTarget.setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (!drag.current) return;
        tx.set(tx.get() + (e.clientX - drag.current.x) * dragSpeed);
        ty.set(ty.get() + (e.clientY - drag.current.y) * dragSpeed);
        drag.current = { x: e.clientX, y: e.clientY };
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerCancel={() => {
        drag.current = null;
      }}
      onKeyDown={(e) => {
        const step = 160;
        const d: Record<string, [number, number]> = {
          ArrowLeft: [step, 0],
          ArrowRight: [-step, 0],
          ArrowUp: [0, step],
          ArrowDown: [0, -step],
        };
        const move = d[e.key];
        if (!move) return;
        e.preventDefault();
        tx.set(tx.get() + move[0]);
        ty.set(ty.get() + move[1]);
      }}
      className={cn(
        "focus-ring relative h-[480px] w-full cursor-grab touch-none overflow-hidden active:cursor-grabbing",
        className,
      )}
      {...props}
    >
      <motion.div style={{ x, y }} className="grid w-max grid-cols-2 will-change-transform">
        {[0, 1, 2, 3].map((i) => tileGrid(i > 0, i))}
      </motion.div>
    </section>
  );
}

export { InfiniteCanvas };
export type { InfiniteCanvasProps };
