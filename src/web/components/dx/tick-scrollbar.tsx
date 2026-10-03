import * as React from "react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

/**
 * TickScrollbara horizontal, tick-ruler scroll indicator you can click or
 * drag to seek, with an optional context card that slides up above it.
 * Inspired by animejs.com.
 */

type TickScrollbarProps = {
  /** Scroll container to track. Omit to track the window. */
  container?: React.RefObject<HTMLElement | null>;
  ticks?: number;
  /** Every Nth tick is emphasised. */
  major?: number;
  /** Card shown above the bar. Change `cardKey` to animate between cards. */
  card?: React.ReactNode;
  cardKey?: React.Key;
  /** Pin to the bottom-right of the viewport. */
  fixed?: boolean;
  className?: string;
  label?: string;
};

const HANDLE = 6;

function TickScrollbar({
  container,
  ticks = 40,
  major = 5,
  card,
  cardKey,
  fixed = false,
  className,
  label = "Scroll position",
}: TickScrollbarProps) {
  const { scrollYProgress } = useScroll(container ? { container } : undefined);
  const [measureRef, bounds] = useMeasure();
  const trackRef = React.useRef<HTMLDivElement>(null);
  const x = useSpring(0, { stiffness: 700, damping: 50 });
  const [ghost, setGhost] = React.useState<number | null>(null);
  const [dragging, setDragging] = React.useState(false);
  const [pct, setPct] = React.useState(0);

  const width = Math.max(0, bounds.width - HANDLE);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    x.set(v * width);
    setPct(Math.round(v * 100));
  });
  React.useEffect(() => x.jump(scrollYProgress.get() * width), [width, x, scrollYProgress]);

  const seek = (ratio: number) => {
    const r = Math.min(1, Math.max(0, ratio));
    const el = container?.current;
    if (el) el.scrollTo({ top: (el.scrollHeight - el.clientHeight) * r, behavior: "instant" });
    else window.scrollTo({ top: (document.documentElement.scrollHeight - window.innerHeight) * r, behavior: "instant" });
  };
  const ratioAt = (clientX: number) => {
    const r = trackRef.current?.getBoundingClientRect();
    return r ? (clientX - r.left) / r.width : 0;
  };

  const bars = React.useMemo(
    () =>
      Array.from({ length: ticks }, (_, i) => (
        <motion.span
          key={i}
          aria-hidden
          initial={{ opacity: 0.2, filter: "blur(1px)" }}
          animate={{ opacity: i % major === 0 ? 1 : 0.25, filter: "blur(0px)" }}
          transition={{ duration: 0.2, delay: i % major === 0 ? (i / major) * 0.05 : 0, ease: "easeOut" }}
          className="h-[15px] w-px bg-foreground"
        />
      )),
    [ticks, major],
  );

  return (
    <div
      data-slot="tick-scrollbar"
      className={cn("flex w-72 flex-col overflow-hidden rounded-2xl", fixed && "fixed right-1/2 bottom-5 z-40 translate-x-1/2 sm:right-5 sm:translate-x-0", className)}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {card && (
          <motion.div
            key={cardKey ?? "card"}
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0 }}
            className="mb-2 rounded-xl border border-outline-variant bg-card p-4 text-card-foreground"
          >
            {card}
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={measureRef} className="rounded-xl border border-outline-variant bg-card px-5">
        <div
          ref={trackRef}
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          className="focus-ring relative flex h-10 cursor-grab touch-none items-center justify-between rounded-xl select-none active:cursor-grabbing"
          onPointerDown={(e) => {
            e.currentTarget.setPointerCapture(e.pointerId);
            setDragging(true);
            seek(ratioAt(e.clientX));
          }}
          onPointerMove={(e) => {
            if (dragging) seek(ratioAt(e.clientX));
            else setGhost(Math.min(width, Math.max(0, e.clientX - (trackRef.current?.getBoundingClientRect().left ?? 0))));
          }}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onPointerLeave={() => setGhost(null)}
          onKeyDown={(e) => {
            const step = e.shiftKey ? 0.1 : 0.02;
            const now = scrollYProgress.get();
            const next: Record<string, number> = {
              ArrowRight: now + step,
              ArrowUp: now + step,
              ArrowLeft: now - step,
              ArrowDown: now - step,
              Home: 0,
              End: 1,
            };
            if (e.key in next) {
              e.preventDefault();
              seek(next[e.key]);
            }
          }}
        >
          {bars}
          {ghost !== null && !dragging && (
            <span aria-hidden className="pointer-events-none absolute left-0 h-6 rounded-full bg-[var(--dx-red-3)]/30" style={{ width: HANDLE, transform: `translateX(${ghost}px)` }} />
          )}
          <motion.span aria-hidden style={{ x, width: HANDLE }} className="pointer-events-none absolute left-0 h-6 rounded-full bg-[var(--dx-red-3)]" />
        </div>
      </div>
    </div>
  );
}

export { TickScrollbar };
export type { TickScrollbarProps };
