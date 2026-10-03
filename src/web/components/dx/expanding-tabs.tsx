import * as React from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import useMeasure from "react-use-measure";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * ExpandingTabsicon tabs whose label unfolds when selected.
 * MorphPanela floating dock that grows into the selected tab's content.
 *
 */

type ExpandingTab = { title: string; icon: LucideIcon };

const labelTransition = { delay: 0.1, type: "spring" as const, bounce: 0, duration: 0.6 };

type ExpandingTabsProps = {
  tabs: ExpandingTab[];
  selected: number | null;
  onSelectedChange: (index: number | null, direction: 1 | -1) => void;
  /** Allow clicking the active tab to collapse it. */
  collapsible?: boolean;
  className?: string;
};

function ExpandingTabs({ tabs, selected, onSelectedChange, collapsible = true, className }: ExpandingTabsProps) {
  return (
    <div data-slot="expanding-tabs" role="tablist" className={cn("flex h-9 w-full items-center justify-center gap-1", className)}>
      {tabs.map((tab, i) => {
        const active = selected === i;
        const Icon = tab.icon;
        return (
          <motion.button
            key={tab.title}
            type="button"
            role="tab"
            tabIndex={0}
            aria-selected={active}
            aria-label={tab.title}
            initial={false}
            animate={{ gap: active ? "0.5rem" : 0, paddingLeft: active ? "0.875rem" : "0.5rem", paddingRight: active ? "0.875rem" : "0.5rem" }}
            onClick={() => {
              if (active) {
                if (collapsible) onSelectedChange(null, 1);
                return;
              }
              onSelectedChange(i, selected === null || i > selected ? 1 : -1);
            }}
            className={cn(
              "focus-ring relative flex h-full items-center justify-center rounded-full text-sm font-medium transition-colors duration-300",
              active ? "bg-container-higher text-foreground" : "text-muted-foreground hover:bg-container-high hover:text-foreground",
            )}
          >
            <Icon className="size-4 shrink-0" />
            <AnimatePresence initial={false}>
              {active && (
                <motion.span
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "auto", opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  transition={labelTransition}
                  className="overflow-hidden whitespace-nowrap"
                >
                  {tab.title}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  const cb = React.useRef(handler);
  cb.current = handler;
  React.useEffect(() => {
    const listener = (e: PointerEvent) => {
      const el = ref.current;
      if (!el || el.contains(e.target as Node)) return;
      // ignore clicks inside portalled popups opened from within the panel
      if ((e.target as Element).closest?.("[data-base-ui-portal],[data-slot$='-popup']")) return;
      cb.current();
    };
    document.addEventListener("pointerdown", listener);
    return () => document.removeEventListener("pointerdown", listener);
  }, [ref]);
}

const slide = {
  initial: (d: number) => ({ x: `${110 * d}%`, opacity: 0 }),
  active: { x: "0%", opacity: 1 },
  exit: (d: number) => ({ x: `${-110 * d}%`, opacity: 0 }),
};

type MorphPanelTab = ExpandingTab & { content: React.ReactNode };

type MorphPanelProps = {
  tabs: MorphPanelTab[];
  defaultSelected?: number | null;
  collapsedWidth?: number;
  expandedWidth?: number;
  className?: string;
};

function MorphPanel({ tabs, defaultSelected = null, collapsedWidth = 212, expandedWidth = 300, className }: MorphPanelProps) {
  const [selected, setSelected] = React.useState<number | null>(defaultSelected);
  const [direction, setDirection] = React.useState<1 | -1>(1);
  const [ref, bounds] = useMeasure();
  const containerRef = React.useRef<HTMLDivElement>(null);
  useClickOutside(containerRef, () => selected !== null && setSelected(null));

  return (
    <MotionConfig transition={{ duration: 0.5, type: "spring", bounce: 0 }}>
      <motion.div
        ref={containerRef}
        data-slot="morph-panel"
        initial={false}
        animate={{
          height: selected === null ? 52 : bounds.height || "auto",
          width: selected === null ? collapsedWidth : expandedWidth,
        }}
        className={cn("bg-popover shadow-float relative mx-auto overflow-hidden rounded-[26px] border border-outline-variant", className)}
      >
        <div ref={ref}>
          <AnimatePresence mode="popLayout" initial={false} custom={direction}>
            <motion.div
              key={selected ?? "none"}
              variants={slide}
              initial="initial"
              animate="active"
              exit="exit"
              custom={direction}
              className="p-2 pb-12"
            >
              {selected !== null ? tabs[selected]?.content : null}
            </motion.div>
          </AnimatePresence>
          <div className="bg-popover absolute inset-x-0 bottom-0 p-2">
            <ExpandingTabs
              tabs={tabs}
              selected={selected}
              onSelectedChange={(i, d) => {
                setDirection(d);
                setSelected(i);
              }}
            />
          </div>
        </div>
      </motion.div>
    </MotionConfig>
  );
}

export { ExpandingTabs, MorphPanel, useClickOutside };
export type { ExpandingTab, ExpandingTabsProps, MorphPanelProps, MorphPanelTab };
