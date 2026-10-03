import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * IconAccordiona stacked list where the open row detaches into its own
 * pill and neighbours round their corners to meet it.
 *
 */

type IconAccordionItem = { icon: React.ReactNode; title: string; description: React.ReactNode };

type IconAccordionProps = {
  items: IconAccordionItem[];
  value?: number | null;
  defaultValue?: number | null;
  onValueChange?: (value: number | null) => void;
  radius?: number;
  className?: string;
};

function IconAccordion({ items, value, defaultValue = null, onValueChange, radius = 20, className }: IconAccordionProps) {
  const [internal, setInternal] = React.useState<number | null>(defaultValue);
  const active = value !== undefined ? value : internal;
  const set = (v: number | null) => {
    if (value === undefined) setInternal(v);
    onValueChange?.(v);
  };
  const r = `${radius}px`;
  const last = items.length - 1;

  return (
    <ul data-slot="icon-accordion" className={cn("w-full max-w-sm select-none", className)}>
      {items.map((item, i) => {
        const open = active === i;
        const roundTop = i === 0 || open || (active !== null && i === active + 1);
        const roundBottom = i === last || open || (active !== null && i === active - 1);
        const panelId = `dx-ia-${i}`;
        return (
          <motion.li
            key={item.title}
            initial={false}
            animate={{
              marginBlock: open ? "8px" : "0px",
              borderTopLeftRadius: roundTop ? r : "0px",
              borderTopRightRadius: roundTop ? r : "0px",
              borderBottomLeftRadius: roundBottom ? r : "0px",
              borderBottomRightRadius: roundBottom ? r : "0px",
            }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="bg-container-high relative overflow-hidden"
          >
            <button
              type="button"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => set(open ? null : i)}
              className="state-layer focus-ring flex h-12 w-full items-center gap-3 px-4 text-left text-sm"
            >
              <span className="text-foreground/80 flex size-5 shrink-0 items-center justify-center [&_svg]:size-[18px]">{item.icon}</span>
              <span className="flex-1 font-medium tracking-[-0.01em]">{item.title}</span>
              <ChevronDown className={cn("text-muted-foreground size-4 transition-transform duration-300", open && "rotate-180")} />
            </button>
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  id={panelId}
                  key="panel"
                  initial={{ height: 0, opacity: 0, filter: "blur(2px)" }}
                  animate={{ height: "auto", opacity: 1, filter: "blur(0px)" }}
                  exit={{ height: 0, opacity: 0, filter: "blur(2px)" }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                >
                  <div className="text-muted-foreground px-4 pb-4 pl-12 text-sm leading-relaxed">{item.description}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        );
      })}
    </ul>
  );
}

export { IconAccordion };
export type { IconAccordionItem, IconAccordionProps };
