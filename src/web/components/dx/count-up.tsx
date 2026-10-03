import * as React from "react";
import { animate, useInView, type Easing } from "motion/react";

import { cn } from "@/lib/utils";
import { NumberFlow } from "@/components/dx/number-flow";

/**
 * CountUpcounts from one value to another when it scrolls into view.
 * Three renderers: plain tween text, a slot-machine "scramble", or the DX
 * NumberFlow morph.
 */

type CountUpProps = {
  to: number;
  from?: number;
  /** Seconds. */
  duration?: number;
  ease?: Easing;
  /** "tween" interpolates, "scramble" flashes random values that climb, "flow" morphs digits with NumberFlow. */
  mode?: "tween" | "scramble" | "flow";
  /** Replay every time it re-enters the viewport. */
  repeat?: boolean;
  /** Start immediately instead of waiting for the viewport. */
  immediate?: boolean;
  prefix?: string;
  suffix?: string;
  locale?: string;
  format?: Intl.NumberFormatOptions;
  className?: string;
  onComplete?: () => void;
};

const DEFAULT_FORMAT: Intl.NumberFormatOptions = { maximumFractionDigits: 0 };

function CountUp({
  to,
  from = 0,
  duration = 1,
  ease = "easeInOut",
  mode = "tween",
  repeat = false,
  immediate = false,
  prefix = "",
  suffix = "",
  locale = "en-US",
  format = DEFAULT_FORMAT,
  className,
  onComplete,
}: CountUpProps) {
  const ref = React.useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: !repeat, amount: 0.5 });
  const active = immediate || inView;
  const [value, setValue] = React.useState(from);
  const fmt = React.useMemo(() => new Intl.NumberFormat(locale, format), [locale, format]);
  const done = React.useRef(onComplete);
  done.current = onComplete;

  React.useEffect(() => {
    if (!active) {
      setValue(from);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(to);
      return;
    }
    if (mode === "flow") {
      // NumberFlow animates the change itself; sample a few steps so digits roll.
      const steps = 4;
      let i = 0;
      const id = window.setInterval(() => {
        i++;
        setValue(i >= steps ? to : from + ((to - from) * i) / steps);
        if (i >= steps) {
          window.clearInterval(id);
          done.current?.();
        }
      }, (duration * 1000) / steps);
      return () => window.clearInterval(id);
    }
    if (mode === "scramble") {
      const steps = Math.max(6, Math.round(duration * 12));
      let i = 0;
      const id = window.setInterval(() => {
        i++;
        if (i < steps) {
          const min = from + (i * (to - from)) / steps;
          setValue(min + Math.random() * (Math.max(to, from) * 1.05 - min));
        } else {
          setValue(to);
          window.clearInterval(id);
          done.current?.();
        }
      }, (duration * 1000) / steps);
      return () => window.clearInterval(id);
    }
    const controls = animate(from, to, { duration, ease, onUpdate: setValue, onComplete: () => done.current?.() });
    return () => controls.stop();
  }, [active, from, to, duration, ease, mode]);

  if (mode === "flow") {
    return (
      <span ref={ref} data-slot="count-up" className={cn("inline-flex", className)}>
        <NumberFlow value={Math.round(value)} prefix={prefix} suffix={suffix} locale={locale} format={format} />
      </span>
    );
  }
  return (
    <span ref={ref} data-slot="count-up" className={cn("tabular-nums", className)}>
      {prefix}
      {fmt.format(mode === "scramble" && value !== to ? Math.floor(value) : value)}
      {suffix}
    </span>
  );
}

export { CountUp };
export type { CountUpProps };
