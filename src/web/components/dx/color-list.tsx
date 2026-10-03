import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * ColorLista scrolling index where the row crossing the focus line takes
 * over: the background washes to its colour, the row lights up and a
 * floating preview swaps to its media. Optionally loops forever.
 */

type ColorListItem = {
  id: string;
  name: string;
  badge?: string;
  meta?: string;
  /** Background colour while active. Hex colours pick a readable text colour automatically. */
  color: string;
  /** Text colour override. */
  foreground?: string;
  /** Image URL or any CSS background for the preview tile. */
  preview?: string;
};

type ColorListProps = {
  items: ColorListItem[];
  /** Repeat the list and keep appending as you near the end. */
  infinite?: boolean;
  /** Where the focus line sits, as a fraction of the viewport height. */
  focusLine?: number;
  showPreview?: boolean;
  previewSize?: "sm" | "md" | "lg";
  /** Fires when the active row changeshook a tick sound or analytics here. */
  onActiveChange?: (item: ColorListItem, index: number) => void;
  className?: string;
  itemClassName?: string;
};

function readable(color: string) {
  const m = /^#?([\da-f]{3}|[\da-f]{6})$/i.exec(color.trim());
  if (!m) return "#121317";
  let hex = m[1];
  if (hex.length === 3) hex = [...hex].map((c) => c + c).join("");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
  const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return lum > 0.55 ? "#121317" : "#ffffff";
}

const SIZES = { sm: "size-40", md: "size-56", lg: "size-72" };

function ColorList({
  items,
  infinite = true,
  focusLine = 0.35,
  showPreview = true,
  previewSize = "md",
  onActiveChange,
  className,
  itemClassName,
}: ColorListProps) {
  const root = React.useRef<HTMLDivElement>(null);
  const rows = React.useRef<(HTMLDivElement | null)[]>([]);
  const [sets, setSets] = React.useState(infinite ? 3 : 1);
  const [active, setActive] = React.useState(0);
  const onChange = React.useRef(onActiveChange);
  onChange.current = onActiveChange;

  const total = items.length * sets;
  const current = items[active % items.length];
  const fg = current?.foreground ?? readable(current?.color ?? "");

  const first = React.useRef(true);
  React.useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    onChange.current?.(items[active % items.length], active);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  React.useEffect(() => {
    const el = root.current;
    if (!el) return;
    const top = Math.round(focusLine * 100);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          const i = Number((e.target as HTMLElement).dataset.index);
          setActive(i);
        }
      },
      { root: el, rootMargin: `-${top}% 0px -${100 - top - 1}% 0px`, threshold: 0 },
    );
    rows.current.slice(0, total).forEach((r) => r && io.observe(r));
    return () => io.disconnect();
  }, [items, total, focusLine]);

  const onScroll = () => {
    const el = root.current;
    if (!infinite || !el) return;
    if (el.scrollTop + el.clientHeight > el.scrollHeight - el.clientHeight) setSets((s) => s + 2);
  };

  return (
    <motion.div
      data-slot="color-list"
      animate={{ backgroundColor: current?.color, color: fg }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={cn("relative h-[480px] w-full overflow-hidden", className)}
      style={{ backgroundColor: current?.color, color: fg }}
    >
      <div ref={root} onScroll={onScroll} className="absolute inset-0 overflow-y-auto overscroll-contain scrollbar-none">
        <div aria-hidden style={{ height: `${focusLine * 100}%` }} />
        <div className="flex flex-col gap-2 whitespace-nowrap">
          {Array.from({ length: total }, (_, i) => {
            const item = items[i % items.length];
            const on = i === active;
            return (
              <div
                key={`${item.id}-${i}`}
                ref={(el) => {
                  rows.current[i] = el;
                }}
                data-index={i}
                data-active={on || undefined}
                className={cn(
                  "flex items-center gap-6 px-6 py-2 transition-opacity duration-300 md:px-10",
                  on ? "opacity-100" : "opacity-25 hover:opacity-60",
                  itemClassName,
                )}
              >
                <span className="text-4xl font-medium tracking-[-0.05em] md:text-6xl">{item.name}</span>
                {item.badge && <span className="rounded-full bg-current/10 px-3.5 py-1.5 text-sm font-medium">{item.badge}</span>}
                {item.meta && <span className="ml-auto hidden text-sm md:block">{item.meta}</span>}
              </div>
            );
          })}
        </div>
        <div aria-hidden style={{ height: `${(1 - focusLine) * 100}%` }} />
      </div>

      {showPreview && current && (
        <div className={cn("pointer-events-none absolute right-6 bottom-6 z-10 hidden overflow-hidden rounded-3xl shadow-float md:block", SIZES[previewSize])}>
          <AnimatePresence initial={false}>
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 1.08 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
              style={{
                background: current.preview
                  ? /^(https?:|\/|data:)/.test(current.preview)
                    ? `center / cover no-repeat url("${current.preview}")`
                    : current.preview
                  : `linear-gradient(135deg, ${current.color}, color-mix(in srgb, ${current.color} 40%, #000))`,
              }}
            />
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}

export { ColorList };
export type { ColorListItem, ColorListProps };
