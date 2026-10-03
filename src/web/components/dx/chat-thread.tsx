import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { TextShimmer } from "@/components/dx/text-shimmer";
import { cn } from "@/lib/utils";

/**
 * ChatThreada scrolling message list that sticks to the newest message,
 * with spring-in bubbles and a shimmering "thinking" row.
 */

type ChatThreadProps = React.ComponentProps<"div"> & {
  /** Fade messages under the top edge. */
  fade?: boolean;
};

function ChatThread({ className, children, fade = true, ...props }: ChatThreadProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const endRef = React.useRef<HTMLDivElement>(null);
  const count = React.Children.count(children);

  React.useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [count]);

  return (
    <div
      ref={ref}
      data-slot="chat-thread"
      role="log"
      aria-live="polite"
      className={cn("flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto overscroll-contain px-1 py-4", className)}
      style={fade ? { maskImage: "linear-gradient(to bottom, transparent 0, #000 40px)", WebkitMaskImage: "linear-gradient(to bottom, transparent 0, #000 40px)" } : undefined}
      {...props}
    >
      <div className="mt-auto" />
      <AnimatePresence initial={false}>{children}</AnimatePresence>
      <div ref={endRef} />
    </div>
  );
}

type ChatBubbleProps = Omit<React.ComponentProps<typeof motion.div>, "children"> & {
  from?: "user" | "assistant";
  children?: React.ReactNode;
};

function ChatBubble({ from = "user", className, children, ...props }: ChatBubbleProps) {
  const user = from === "user";
  return (
    <motion.div
      layout="position"
      data-slot="chat-bubble"
      data-from={from}
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
      className={cn(
        "w-fit max-w-[80%] px-4 py-2.5 text-[15px] leading-[1.45] break-words",
        user
          ? "self-end rounded-[18px_18px_6px_18px] bg-container-high text-foreground"
          : "self-start rounded-[18px_18px_18px_6px] text-foreground",
        className,
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}

function ChatThinking({ label = "Thinking…", className }: { label?: string; className?: string }) {
  return (
    <motion.div
      data-slot="chat-thinking"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.2 }}
      className={cn("self-start px-4 py-2.5 text-[15px]", className)}
    >
      <TextShimmer>{label}</TextShimmer>
    </motion.div>
  );
}

export { ChatBubble, ChatThinking, ChatThread };
export type { ChatBubbleProps, ChatThreadProps };
