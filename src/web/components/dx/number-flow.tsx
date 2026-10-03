import * as React from "react";
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import useMeasure from "react-use-measure";

import { cn } from "@/lib/utils";

/**
 * NumberFlowformatted numbers whose characters morph into place via shared layout.
 *
 */

type NumberFlowProps = {
  value: number;
  prefix?: string;
  suffix?: string;
  locale?: string;
  format?: Intl.NumberFormatOptions;
  className?: string;
  /** Spring used for every character. */
  transition?: React.ComponentProps<typeof MotionConfig>["transition"];
};

function NumberFlow({
  value,
  prefix,
  suffix,
  locale = "en-US",
  format = { maximumFractionDigits: 2 },
  className,
  transition = { type: "spring", stiffness: 400, damping: 35 },
}: NumberFlowProps) {
  const id = React.useId();
  const [ref, bounds] = useMeasure();
  const text = React.useMemo(() => new Intl.NumberFormat(locale, format).format(value), [value, locale, format]);

  const counts: Record<string, number> = {};
  const chars = text.split("").map((ch) => {
    counts[ch] = (counts[ch] ?? 0) + 1;
    return { ch, key: counts[ch] > 1 ? `${ch}-${counts[ch]}` : ch };
  });

  return (
    <MotionConfig transition={transition}>
      <LayoutGroup id={id}>
        <motion.span
          data-slot="number-flow"
          aria-label={`${prefix ?? ""}${text}${suffix ?? ""}`}
          initial={false}
          animate={{ width: bounds.width || "auto" }}
          className={cn("inline-flex overflow-hidden align-bottom tabular-nums", className)}
        >
          <span ref={ref} aria-hidden className="inline-flex whitespace-nowrap">
            {prefix && <motion.span layout="position" className="inline-block">{prefix}</motion.span>}
            {chars.map(({ ch, key }) => (
              <motion.span key={key} layoutId={key} className="inline-block">
                {ch}
              </motion.span>
            ))}
            {suffix && <motion.span layout="position" className="inline-block">{suffix}</motion.span>}
          </span>
        </motion.span>
      </LayoutGroup>
    </MotionConfig>
  );
}

export { NumberFlow };
export type { NumberFlowProps };
