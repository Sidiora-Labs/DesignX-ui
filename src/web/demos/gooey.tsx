import * as React from "react";
import { motion } from "motion/react";
import { PlusIcon } from "lucide-react";

import { Gooey } from "@/components/dx/gooey";

const items = ["A", "B", "C"];

export default function GooeyDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="flex h-64 items-end justify-center pb-6">
      <Gooey className="relative flex flex-col items-center">
        {items.map((label, i) => (
          <motion.div
            key={label}
            initial={false}
            animate={{ y: open ? -(i + 1) * 60 : 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 18, delay: open ? i * 0.04 : 0 }}
            className="absolute grid size-12 place-items-center rounded-full bg-foreground text-sm font-medium text-background"
          >
            {label}
          </motion.div>
        ))}
        <button
          type="button"
          aria-label={open ? "Close" : "Open"}
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="relative grid size-14 place-items-center rounded-full bg-foreground text-background"
        >
          <motion.span animate={{ rotate: open ? 45 : 0 }}>
            <PlusIcon className="size-5" />
          </motion.span>
        </button>
      </Gooey>
    </div>
  );
}
