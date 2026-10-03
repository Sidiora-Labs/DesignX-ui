import * as React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckIcon, CopyIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export function CopyButton({ value, className, label = "Copy" }: { value: string; className?: string; label?: string }) {
  const [copied, setCopied] = React.useState(false);
  React.useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1600);
    return () => clearTimeout(t);
  }, [copied]);

  return (
    <Tooltip>
      <TooltipTrigger
        render={
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={label}
            className={cn("text-muted-foreground hover:text-foreground", className)}
            onClick={() => {
              void navigator.clipboard?.writeText(value);
              setCopied(true);
            }}
          />
        }
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "ok" : "copy"}
            initial={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.6, filter: "blur(2px)" }}
            transition={{ type: "spring", bounce: 0, duration: 0.3 }}
            className="inline-flex"
          >
            {copied ? <CheckIcon className="size-3.5" /> : <CopyIcon className="size-3.5" />}
          </motion.span>
        </AnimatePresence>
      </TooltipTrigger>
      <TooltipContent>{copied ? "Copied" : label}</TooltipContent>
    </Tooltip>
  );
}
