import * as React from "react";
import { motion, useReducedMotion } from "motion/react";
import { BellIcon, BellOffIcon, MicIcon, PauseIcon, PhoneIcon, PhoneOffIcon, PlayIcon, TimerIcon } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * DynamicIslanda black pill that springs between content states. The
 * shell animates its size with `layout`; each view fades in from a blur.
 * Bounce can depend on the transition (e.g. "idle-ring": 0.5).
 */

const DEFAULT_BOUNCE: Record<string, number> = {
  "*-idle": 0.5,
  "idle-ring": 0.5,
  "ring-timer": 0.35,
  "timer-ring": 0.35,
  "idle-timer": 0.3,
  "timer-idle": 0.3,
};

type DynamicIslandProps = Omit<React.ComponentProps<typeof motion.div>, "children"> & {
  /** Key of the current state. Changing it plays the morph. */
  view: string;
  children?: React.ReactNode;
  /** One bounce for every change, or a map keyed "from-to" ("*-to" and "from-*" work too). */
  bounce?: number | Record<string, number>;
  /** Fallback bounce when the map has no match. */
  defaultBounce?: number;
};

function usePrevious<T>(value: T) {
  const [state, setState] = React.useState({ current: value, previous: value });
  if (state.current !== value) setState({ current: value, previous: state.current });
  return state.previous;
}

function DynamicIsland({ view, children, bounce = DEFAULT_BOUNCE, defaultBounce = 0.2, className, style, ...props }: DynamicIslandProps) {
  const previous = usePrevious(view);
  const reduce = useReducedMotion();
  const b =
    typeof bounce === "number"
      ? bounce
      : (bounce[`${previous}-${view}`] ?? bounce[`*-${view}`] ?? bounce[`${previous}-*`] ?? defaultBounce);
  const transition = reduce ? { duration: 0 } : { type: "spring" as const, bounce: b, duration: 0.6 };

  return (
    <motion.div
      layout
      data-slot="dynamic-island"
      data-view={view}
      transition={transition}
      style={{ borderRadius: 32, ...style }}
      className={cn("mx-auto w-fit min-w-[100px] overflow-hidden bg-black text-white", className)}
      {...props}
    >
      <motion.div
        key={view}
        initial={reduce ? false : { scale: 0.9, opacity: 0, filter: "blur(5px)" }}
        animate={{ scale: 1, opacity: 1, filter: "blur(0px)", transition: { ...transition, delay: 0.05 } }}
      >
        {children ?? <div className="h-7" />}
      </motion.div>
    </motion.div>
  );
}

/* ---------- Ready-made views ---------- */

function IslandIdle() {
  return <div className="h-7 w-[100px]" />;
}

/** Silent-mode switch: bell shakes, label swaps. */
function IslandRing({ silent = false }: { silent?: boolean }) {
  return (
    <div className="flex h-7 w-[148px] items-center justify-between px-2.5">
      <motion.span
        initial={{ rotate: 0 }}
        animate={{ rotate: silent ? 0 : [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0] }}
        transition={{ duration: 0.9 }}
        className={cn("flex size-5 items-center justify-center rounded-full", silent ? "bg-[#ff3b30]" : "")}
      >
        {silent ? <BellOffIcon className="size-3" /> : <BellIcon className="size-3.5" />}
      </motion.span>
      <span className={cn("text-xs font-medium", silent ? "text-[#ff3b30]" : "text-white")}>{silent ? "Silent" : "Ring"}</span>
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, "0")}`;
}

/** A live countdown with pause/resume. */
function IslandTimer({ seconds = 300, label = "Timer" }: { seconds?: number; label?: string }) {
  const [left, setLeft] = React.useState(seconds);
  const [paused, setPaused] = React.useState(false);
  React.useEffect(() => {
    if (paused || left <= 0) return;
    const id = window.setInterval(() => setLeft((l) => Math.max(0, l - 1)), 1000);
    return () => window.clearInterval(id);
  }, [paused, left]);
  return (
    <div className="flex h-[60px] w-[280px] items-center gap-2 px-3">
      <button
        type="button"
        aria-label={paused ? "Resume" : "Pause"}
        onClick={() => setPaused((p) => !p)}
        className="flex size-9 items-center justify-center rounded-full bg-[#ff9f0a]/25 text-[#ff9f0a] transition-colors hover:bg-[#ff9f0a]/35"
      >
        {paused ? <PlayIcon className="size-4 fill-current" /> : <PauseIcon className="size-4 fill-current" />}
      </button>
      <button
        type="button"
        aria-label="Reset"
        onClick={() => setLeft(seconds)}
        className="flex size-9 items-center justify-center rounded-full bg-white/15 transition-colors hover:bg-white/25"
      >
        <TimerIcon className="size-4" />
      </button>
      <span className="ml-auto flex items-baseline gap-2 text-[#ff9f0a]">
        <span className="text-xs">{label}</span>
        <span className="text-3xl font-light tabular-nums" aria-live="off">
          {formatTime(left)}
        </span>
      </span>
    </div>
  );
}

/** Recording indicator with a live level meter. */
function IslandRecord({ label = "Recording" }: { label?: string }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-7 w-[220px] items-center justify-between px-2.5">
      <span className="flex items-center gap-2 text-xs">
        <MicIcon className="size-3.5 text-[#ff3b30]" />
        {label}
      </span>
      <span className="flex h-3 items-center gap-[2px]" aria-hidden>
        {Array.from({ length: 10 }, (_, i) => (
          <motion.span
            key={i}
            className="w-[2px] rounded-full bg-[#ff3b30]"
            initial={{ height: 3 }}
            animate={reduce ? { height: 6 } : { height: [3, 6 + ((i * 7) % 7), 3] }}
            transition={{ duration: 0.6 + (i % 4) * 0.12, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
          />
        ))}
      </span>
    </div>
  );
}

/** Now playing: artwork, title and animated bars. */
function IslandMusic({
  title = "Midnight City",
  artist = "M83",
  artwork = "linear-gradient(135deg, var(--dx-purple-3), var(--dx-pink-3))",
}: {
  title?: string;
  artist?: string;
  /** CSS background for the artwork tile. */
  artwork?: string;
}) {
  const reduce = useReducedMotion();
  return (
    <div className="flex h-[72px] w-[320px] items-center gap-3 px-3">
      <span className="size-12 shrink-0 rounded-xl" style={{ background: artwork }} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-medium">{title}</span>
        <span className="block truncate text-xs text-white/55">{artist}</span>
      </span>
      <span className="flex h-5 items-end gap-[3px] pr-1" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-[var(--dx-pink-3)]"
            initial={{ height: 6 }}
            animate={reduce ? { height: 10 } : { height: [6, 18, 9, 16, 6] }}
            transition={{ duration: 1 + i * 0.15, repeat: Infinity, ease: "easeInOut", delay: i * 0.1 }}
          />
        ))}
      </span>
    </div>
  );
}

/** Low battery warning. */
function IslandBattery({ level = 10 }: { level?: number }) {
  return (
    <div className="flex h-7 w-[260px] items-center justify-between px-3 text-xs">
      <span>Battery low</span>
      <span className="flex items-center gap-1.5 text-[#ff3b30]">
        {level}%
        <span className="relative flex h-3 w-6 items-center rounded-[4px] border border-[#ff3b30]/70 p-[1.5px]">
          <span className="h-full rounded-[2px] bg-[#ff3b30]" style={{ width: `${Math.max(8, level)}%` }} />
          <span className="absolute -right-[3px] h-1.5 w-[2px] rounded-r-sm bg-[#ff3b30]/70" />
        </span>
      </span>
    </div>
  );
}

/** Incoming call with accept / decline. */
function IslandCall({
  name = "Alex Rivera",
  subtitle = "mobile",
  onAccept,
  onDecline,
}: {
  name?: string;
  subtitle?: string;
  onAccept?: () => void;
  onDecline?: () => void;
}) {
  return (
    <div className="flex h-[72px] w-[340px] items-center gap-3 px-3">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-white/15 text-sm font-medium">
        {name
          .split(" ")
          .map((p) => p[0])
          .join("")
          .slice(0, 2)}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-xs text-white/55">{subtitle}</span>
        <span className="block truncate text-sm font-medium">{name}</span>
      </span>
      <button
        type="button"
        aria-label="Decline"
        onClick={onDecline}
        className="flex size-10 items-center justify-center rounded-full bg-[#ff3b30] transition-transform active:scale-90"
      >
        <PhoneOffIcon className="size-4.5" />
      </button>
      <button
        type="button"
        aria-label="Accept"
        onClick={onAccept}
        className="flex size-10 items-center justify-center rounded-full bg-[#34c759] transition-transform active:scale-90"
      >
        <PhoneIcon className="size-4.5" />
      </button>
    </div>
  );
}

export { DynamicIsland, IslandBattery, IslandCall, IslandIdle, IslandMusic, IslandRecord, IslandRing, IslandTimer };
export type { DynamicIslandProps };
