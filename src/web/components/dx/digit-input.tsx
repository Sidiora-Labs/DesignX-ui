import * as React from "react";
import { AnimatePresence, motion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * DigitInputevery typed character rises into place. The real input stays
 * on top (transparent text) so selection, paste and a11y keep working.
 *
 */

type DigitInputProps = Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Restrict input to digits. */
  numeric?: boolean;
  wrapperClassName?: string;
};

function DigitInput({
  value,
  defaultValue = "",
  onValueChange,
  numeric = false,
  placeholder = "0",
  className,
  wrapperClassName,
  ...props
}: DigitInputProps) {
  const [internal, setInternal] = React.useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : internal;

  return (
    <div
      data-slot="digit-input"
      className={cn(
        "relative w-full overflow-hidden text-center text-[44px] leading-tight font-medium tracking-[-0.03em]",
        wrapperClassName,
      )}
    >
      <input
        {...props}
        inputMode={numeric ? "numeric" : props.inputMode}
        value={current}
        onChange={(e) => {
          const next = numeric ? e.target.value.replace(/\D/g, "") : e.target.value;
          if (!controlled) setInternal(next);
          onValueChange?.(next);
        }}
        className={cn(
          "caret-primary relative z-10 w-full bg-transparent py-2 text-center text-transparent outline-none selection:bg-info/20",
          className,
        )}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {current === "" && <span className="text-muted-foreground/40">{placeholder}</span>}
        <AnimatePresence initial={false} mode="popLayout">
          {current.split("").map((ch, i) => (
            <motion.span
              key={`${ch}-${i}`}
              className="inline-block whitespace-pre"
              initial={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
              animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
              exit={{ y: "100%", opacity: 0, filter: "blur(4px)" }}
              transition={{ type: "spring", stiffness: 420, damping: 32 }}
            >
              {ch}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { DigitInput };
export type { DigitInputProps };
