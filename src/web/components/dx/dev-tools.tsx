import * as React from "react";
import { motion, type MotionValue } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Dev toolsa Tailwind breakpoint badge and a live value panel that
 * understands motion values. Both render nothing in production builds unless
 * `force` is set.
 */

const isDev = import.meta.env.DEV;

type BreakpointIndicatorProps = {
  className?: string;
  /** Render in production too. */
  force?: boolean;
  /** Pin to a viewport corner. Set false to render inline. */
  position?: "bottom-left" | "bottom-right" | "top-left" | "top-right" | false;
};

const corners = {
  "bottom-left": "fixed bottom-2 left-2",
  "bottom-right": "fixed bottom-2 right-2",
  "top-left": "fixed top-2 left-2",
  "top-right": "fixed top-2 right-2",
};

function BreakpointIndicator({ className, force, position = "bottom-left" }: BreakpointIndicatorProps) {
  if (!isDev && !force) return null;
  return (
    <div
      data-slot="breakpoint-indicator"
      aria-hidden
      className={cn(
        "z-50 flex h-7 min-w-7 items-center justify-center rounded-full bg-foreground px-2 font-mono text-xs font-medium text-background shadow-md",
        position && corners[position],
        className,
      )}
    >
      <span className="sm:hidden">xs</span>
      <span className="hidden sm:inline md:hidden">sm</span>
      <span className="hidden md:inline lg:hidden">md</span>
      <span className="hidden lg:inline xl:hidden">lg</span>
      <span className="hidden xl:inline 2xl:hidden">xl</span>
      <span className="hidden 2xl:inline">2xl</span>
    </div>
  );
}

type DebugValue = string | number | boolean | null | undefined | MotionValue<number> | MotionValue<string> | object;

type DebugPanelProps = {
  values: Record<string, DebugValue>;
  title?: string;
  className?: string;
  force?: boolean;
};

const isMotionValue = (v: unknown): v is MotionValue => !!v && typeof v === "object" && "get" in v && "on" in v;

function formatValue(v: DebugValue): React.ReactNode {
  if (isMotionValue(v)) return <motion.span>{v as MotionValue<number>}</motion.span>;
  if (typeof v === "string") return `"${v}"`;
  if (v === null || v === undefined || typeof v === "boolean" || typeof v === "number") return String(v);
  try {
    return JSON.stringify(v);
  } catch {
    return String(v);
  }
}

function DebugPanel({ values, title, className, force }: DebugPanelProps) {
  if (!isDev && !force) return null;
  return (
    <div
      data-slot="debug-panel"
      className={cn(
        "rounded-xl border border-border bg-container/90 px-4 py-3 font-mono text-[13px] leading-relaxed text-foreground shadow-sm backdrop-blur",
        className,
      )}
    >
      {title && <div className="mb-1 text-[11px] tracking-wider text-muted-foreground uppercase">{title}</div>}
      <span className="text-muted-foreground">{"{"}</span>
      {Object.entries(values).map(([key, value]) => (
        <div key={key} className="pl-4">
          <span className="text-[var(--dx-purple-3)]">{key}</span>
          <span className="text-muted-foreground">: </span>
          <span className="text-[var(--dx-blue-3)] tabular-nums">{formatValue(value)}</span>
          <span className="text-muted-foreground">,</span>
        </div>
      ))}
      <span className="text-muted-foreground">{"}"}</span>
    </div>
  );
}

export { BreakpointIndicator, DebugPanel };
export type { BreakpointIndicatorProps, DebugPanelProps };
