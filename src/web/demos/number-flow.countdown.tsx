import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { PauseIcon, PlayIcon, RotateCcwIcon } from "lucide-react";

import { NumberFlow } from "@/components/dx/number-flow";

const START = 60;
const FORMAT: Intl.NumberFormatOptions = { minimumIntegerDigits: 2 };
const swap = {
  initial: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
  animate: { opacity: 1, scale: 1, filter: "blur(0px)" },
  exit: { opacity: 0, scale: 0.5, filter: "blur(4px)" },
  transition: { duration: 0.12 },
};

export default function NumberFlowCountdown() {
  const [paused, setPaused] = React.useState(false);
  const [count, setCount] = React.useState(START);

  React.useEffect(() => {
    if (paused) return;
    const id = window.setInterval(() => setCount((c) => (c === 0 ? START : c - 1)), 1000);
    return () => window.clearInterval(id);
  }, [paused]);

  return (
    <div className="grid justify-items-center gap-4">
      <NumberFlow value={count} prefix="0:" format={FORMAT} className="text-8xl font-medium tracking-[-0.04em]" />
      <div className="flex gap-2">
        <motion.button
          type="button"
          aria-label={paused ? "Resume" : "Pause"}
          whileTap={{ scale: 0.9 }}
          onClick={() => setPaused((p) => !p)}
          className="focus-ring flex size-10 items-center justify-center rounded-full bg-[var(--dx-red-3)] text-white"
        >
          <AnimatePresence initial={false} mode="wait">
            <motion.span key={paused ? "play" : "pause"} {...swap}>
              {paused ? <PlayIcon className="size-4 fill-current" /> : <PauseIcon className="size-4 fill-current" />}
            </motion.span>
          </AnimatePresence>
        </motion.button>
        <button
          type="button"
          aria-label="Reset"
          onClick={() => setCount(START)}
          className="focus-ring state-layer flex size-10 items-center justify-center rounded-full bg-container-high text-[var(--dx-red-3)]"
        >
          <RotateCcwIcon className="size-4" />
        </button>
      </div>
    </div>
  );
}
