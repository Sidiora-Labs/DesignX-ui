import { AnimatePresence, motion } from "motion/react";

import { useLoop } from "@/components/dx/text-loop";

const words = ["uno", "dos", "tres", "cuatro", "cinco"];

export default function UseLoopDemo() {
  const { key } = useLoop(1000);
  return (
    <div className="grid justify-items-center gap-3">
      <span className="font-mono text-xs text-muted-foreground">key = {key}</span>
      <div className="h-10 overflow-hidden">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={key}
            initial={{ opacity: 0, y: "100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-semibold"
          >
            Tik-Tik {words[key % words.length]}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
