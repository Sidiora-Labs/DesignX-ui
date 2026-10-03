import * as React from "react";
import { type MotionValue, motion, useScroll, useTransform } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * StackScrolla sticky, scroll-driven sequence of steps. Each step rises in
 * as its slice of the scroll range is reached and a progress rail fills.
 *
 */

type StackScrollItem = { title: string; description: string; media?: React.ReactNode };

type StackScrollProps = {
  items: StackScrollItem[];
  /** Total scroll distance for the sequence (CSS length). */
  scrollLength?: string;
  /** Scroll container; defaults to the window. */
  containerRef?: React.RefObject<HTMLElement | null>;
  className?: string;
};

function Step({ item, index, total, progress }: { item: StackScrollItem; index: number; total: number; progress: MotionValue<number> }) {
  const start = index / total;
  const end = (index + 1) / total;
  const mediaY = useTransform(progress, [start, end], [-40, 0]);
  const textY = useTransform(progress, [start, end], [40, 0]);
  const scale = useTransform(progress, [start, end], [0, 1]);
  const opacity = useTransform(progress, [start, end], [0, 1]);
  const fill = useTransform(progress, [start, end], [0, 1]);
  return (
    <div className="relative z-10 flex flex-col gap-8">
      <motion.div style={{ y: mediaY, opacity }} className="bg-container-high relative flex aspect-[4/3] items-center justify-center overflow-hidden rounded-xl">
        {item.media}
      </motion.div>
      <div className="relative flex items-center">
        <div aria-hidden className="bg-container-higher absolute inset-x-0 h-0.5 rounded-full" />
        <motion.div
          aria-hidden
          style={{ scaleX: fill }}
          className="bg-primary primary-fill absolute inset-x-0 h-0.5 origin-left rounded-full"
        />
        <motion.div style={{ scale }} className="bg-primary text-primary-foreground primary-fill relative flex size-8 items-center justify-center rounded-full font-mono text-xs">
          {String(index + 1).padStart(2, "0")}
        </motion.div>
      </div>
      <motion.div style={{ y: textY, opacity }} className="space-y-2">
        <h3 className="text-xl font-medium tracking-[-0.02em]">{item.title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
      </motion.div>
    </div>
  );
}

function StackScroll({ items, scrollLength = "300vh", containerRef, className }: StackScrollProps) {
  const target = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target, container: containerRef, offset: ["start start", "end end"] });
  return (
    <div data-slot="stack-scroll" ref={target} className={cn("relative", className)} style={{ height: scrollLength }}>
      <div className="sticky top-0 flex h-[var(--stack-h,100vh)] items-center">
        <div className="relative grid w-full gap-8 px-6 md:gap-14" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((item, i) => (
            <Step key={item.title} item={item} index={i} total={items.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </div>
  );
}

export { StackScroll };
export type { StackScrollItem, StackScrollProps };
