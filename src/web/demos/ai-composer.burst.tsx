import * as React from "react";
import { PlusIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

import { Composer, ComposerBurst, ComposerInput, ComposerSend } from "@/components/dx/ai-composer";
import { cn } from "@/lib/utils";

type Msg = { id: number; mine: boolean; text: string };

export default function AiComposerBurst() {
  const [messages, setMessages] = React.useState<Msg[]>([]);
  const [burst, setBurst] = React.useState(0);
  const timer = React.useRef<ReturnType<typeof setTimeout>>(undefined);
  React.useEffect(() => () => clearTimeout(timer.current), []);

  return (
    <div className="relative flex h-[420px] w-full max-w-lg flex-col justify-end overflow-hidden rounded-2xl pb-6">
      <div className="pointer-events-none flex flex-col gap-2 px-2 pb-3">
        <AnimatePresence initial={false}>
          {messages.slice(-4).map((m) => (
            <motion.div
              key={m.id}
              layout="position"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ type: "spring", bounce: 0.4, duration: 0.5 }}
              className={cn(
                "max-w-[260px] px-3.5 py-2.5 text-sm break-words shadow-float",
                m.mine ? "self-end rounded-[14px_14px_6px_14px] bg-card" : "self-start rounded-[14px_14px_14px_6px] bg-[var(--dx-blue-4)] text-white",
              )}
            >
              {m.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="relative overflow-hidden rounded-[28px]">
        <ComposerBurst trigger={burst} className="z-0" />
        <Composer
          onSubmit={(text) => {
            setBurst((b) => b + 1);
            setMessages((m) => [...m, { id: Date.now(), mine: true, text }]);
            timer.current = setTimeout(() => setMessages((m) => [...m, { id: Date.now() + 1, mine: false, text: "On it 🚀" }]), 900);
          }}
          className="flex items-center gap-2 rounded-[28px] bg-card/90 p-1.5 shadow-float backdrop-blur"
        >
          <button type="button" aria-label="Attach" className="focus-ring state-layer flex size-10 shrink-0 items-center justify-center rounded-full bg-container-high">
            <PlusIcon className="size-5 text-muted-foreground" />
          </button>
          <div className="flex-1">
            <ComposerInput placeholder="Send a message" className="min-h-10 px-1 py-2.5" />
          </div>
          <ComposerSend className="size-10" />
        </Composer>
      </div>
    </div>
  );
}
