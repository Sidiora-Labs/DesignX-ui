import * as React from "react";
import { AnimatePresence, motion, useAnimation } from "motion/react";
import { ChevronDown, ChevronUp, Globe, Info, Minus, Plus, SendHorizonal, TriangleAlert } from "lucide-react";

import { cn } from "@/lib/utils";

/**
 * Animated iconsself-contained icon buttons with a signature micro-interaction.
 * Every icon is a <button> with an aria-label; pass `label` to override.
 * Icons follow lucide geometry.
 */

type IconButtonProps = Omit<React.ComponentProps<"button">, "children"> & { label?: string };

const svgProps = {
  xmlns: "http://www.w3.org/2000/svg",
  width: 24,
  height: 24,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const base =
  "focus-ring state-layer text-foreground relative inline-flex size-10 shrink-0 cursor-pointer items-center justify-center overflow-hidden rounded-full [&_svg]:size-[18px]";

function useToggle(initial = false) {
  const [on, setOn] = React.useState(initial);
  return [on, () => setOn((v) => !v)] as const;
}

function SidebarIcon({ className, label = "Toggle sidebar", onClick, ...props }: IconButtonProps) {
  const [on, toggle] = useToggle();
  return (
    <button type="button" aria-label={label} aria-pressed={on} className={cn(base, className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      <span className="relative grid items-center">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="!size-4">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M0.33 2.64C0 3.28 0 4.12 0 5.8v4.4c0 1.68 0 2.52.33 3.16.29.57.74 1.02 1.31 1.31.64.33 1.48.33 3.16.33h6.4c1.68 0 2.52 0 3.16-.33.57-.29 1.02-.74 1.31-1.31.33-.64.33-1.48.33-3.16V5.8c0-1.68 0-2.52-.33-3.16a3 3 0 0 0-1.31-1.31C13.72 1 12.88 1 11.2 1H4.8c-1.68 0-2.52 0-3.16.33-.57.29-1.02.74-1.31 1.31Z"
            fill="currentColor"
          />
        </svg>
        <motion.span className="bg-background absolute left-[3px] h-[10px] rounded-[1px]" initial={false} animate={{ width: on ? 4.5 : 1.5 }} />
      </span>
    </button>
  );
}

function CodeIcon({ className, label = "Toggle code", onClick, ...props }: IconButtonProps) {
  const [on, toggle] = useToggle();
  const t = { duration: 0.3, ease: "easeInOut" as const };
  return (
    <button type="button" aria-label={label} aria-pressed={on} className={cn(base, className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      <svg {...svgProps}>
        <motion.path d="m18 16 4-4-4-4" initial={false} animate={{ x: on ? 2 : 0 }} transition={t} />
        <motion.path d="m6 8-4 4 4 4" initial={false} animate={{ x: on ? -2 : 0 }} transition={t} />
        <motion.path d="m14.5 4-5 16" initial={false} animate={{ y: on ? 22 : 0, x: on ? -5 : 0 }} transition={t} />
        <motion.path d="m14.5 4-5 16" initial={false} animate={{ y: on ? 0 : -22, x: on ? 0 : 5 }} transition={t} />
      </svg>
    </button>
  );
}

function LockIcon({ className, label = "Toggle lock", onClick, ...props }: IconButtonProps) {
  const [unlocked, toggle] = useToggle();
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={unlocked}
      className={cn(base, className)}
      style={{ perspective: 500 }}
      onClick={(e) => (toggle(), onClick?.(e))}
      {...props}
    >
      <svg {...svgProps} overflow="visible" className="!size-4">
        <motion.path style={{ originX: 1 }} initial={false} animate={{ rotateY: unlocked ? 180 : 0 }} transition={{ duration: 0.4, ease: "easeInOut" }} d="M7 11V7a5 5 0 0 1 10 0v12" />
        <rect width="18" height="11" x="3" y="11" rx="2" ry="2" fill="currentColor" />
      </svg>
    </button>
  );
}

function InfoIcon({ className, label = "Info", onClick, ...props }: IconButtonProps) {
  const controls = useAnimation();
  const busy = React.useRef(false);
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(base, className)}
      onClick={async (e) => {
        onClick?.(e);
        if (busy.current) return;
        busy.current = true;
        await controls.start({ rotateY: 360, transition: { duration: 1, ease: "easeInOut" } });
        controls.set({ rotateY: 0 });
        busy.current = false;
      }}
      {...props}
    >
      <motion.span animate={controls}>
        <Info />
      </motion.span>
    </button>
  );
}

function LogoutIcon({ className, label = "Log out", onClick, ...props }: IconButtonProps) {
  const controls = useAnimation();
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(base, className)}
      onClick={(e) => {
        onClick?.(e);
        void controls.start({ x: [0, -3, 0], transition: { duration: 0.4, ease: "easeInOut" } });
      }}
      {...props}
    >
      <svg {...svgProps}>
        <motion.g animate={controls}>
          <path d="m10 17 5-5-5-5" />
          <path d="M15 12H3" />
        </motion.g>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
      </svg>
    </button>
  );
}

function BadgeDollarIcon({ className, label = "Pricing", onClick, ...props }: IconButtonProps) {
  const [on, toggle] = useToggle();
  return (
    <button type="button" aria-label={label} className={cn(base, className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      <motion.svg {...svgProps} initial={false} animate={{ rotateY: on ? 360 : 0 }} transition={{ duration: 0.7, ease: "easeInOut" }}>
        <path d="M3.85 8.62a4 4 0 0 1 4.78-4.77 4 4 0 0 1 6.74 0 4 4 0 0 1 4.78 4.78 4 4 0 0 1 0 6.74 4 4 0 0 1-4.77 4.78 4 4 0 0 1-6.75 0 4 4 0 0 1-4.78-4.77 4 4 0 0 1 0-6.76Z" />
        <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
        <path d="M12 18V6" />
      </motion.svg>
    </button>
  );
}

function CopyIcon({ className, label = "Copy", text = "", onClick, ...props }: IconButtonProps & { text?: string }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <button
      type="button"
      aria-label={copied ? "Copied" : label}
      className={cn(base, className)}
      onClick={async (e) => {
        onClick?.(e);
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          /* clipboard unavailable */
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
      {...props}
    >
      <AnimatePresence mode="wait" initial={false}>
        {!copied ? (
          <motion.svg key="copy" {...svgProps} initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }}>
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </motion.svg>
        ) : (
          <motion.svg key="check" {...svgProps} initial={{ scale: 0.6 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.1 }}>
            <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.25 }} d="M20 6 9 17l-5-5" />
          </motion.svg>
        )}
      </AnimatePresence>
    </button>
  );
}

function WaveformIcon({ className, label = "Play waveform", bars = 9, onClick, ...props }: IconButtonProps & { bars?: number }) {
  const [playing, setPlaying] = React.useState(false);
  const [heights, setHeights] = React.useState<number[]>(() => Array(bars).fill(0.1));
  React.useEffect(() => {
    if (!playing) {
      setHeights(Array(bars).fill(0.1));
      return;
    }
    let id = 0;
    let last = 0;
    const loop = (t: number) => {
      if (t - last > 60) {
        last = t;
        setHeights(Array.from({ length: bars }, () => Math.random() * 0.8 + 0.2));
      }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [playing, bars]);
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={playing}
      className={cn(base, "gap-px", className)}
      onClick={(e) => (setPlaying((p) => !p), onClick?.(e))}
      {...props}
    >
      {heights.map((h, i) => (
        <motion.span key={i} className="bg-foreground w-[2px] rounded-full" animate={{ height: Math.max(3, h * 22) }} transition={{ type: "spring", stiffness: 250, damping: 10 }} />
      ))}
    </button>
  );
}

function swap(on: boolean, a: React.ElementType, b: React.ElementType, rot: [string, string, string, string]) {
  const A = a;
  const B = b;
  return (
    <>
      <A className={cn("absolute transition-all duration-200", on ? `${rot[0]} opacity-0` : `${rot[1]} opacity-100`)} />
      <B className={cn("absolute transition-all duration-200", on ? `${rot[2]} opacity-100` : `${rot[3]} opacity-0`)} />
    </>
  );
}

function PlusMinusIcon({ className, label = "Expand", onClick, ...props }: IconButtonProps) {
  const [on, toggle] = useToggle();
  return (
    <button type="button" aria-label={label} aria-expanded={on} className={cn(base, className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      {swap(on, Plus, Minus, ["rotate-90", "rotate-0", "rotate-0", "-rotate-90"])}
    </button>
  );
}

function ChevronIcon({ className, label = "Toggle", onClick, ...props }: IconButtonProps) {
  const [on, toggle] = useToggle();
  return (
    <button type="button" aria-label={label} aria-expanded={on} className={cn(base, className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      {swap(on, ChevronDown, ChevronUp, ["-rotate-90", "rotate-0", "rotate-0", "rotate-90"])}
    </button>
  );
}

function MenuIcon({ className, label = "Menu", onClick, ...props }: IconButtonProps) {
  const [on, toggle] = useToggle();
  const bar = "bg-foreground h-[1.5px] rounded-full transition-all duration-300 ease-[var(--ease-dx)]";
  return (
    <button type="button" aria-label={label} aria-expanded={on} className={cn(base, "group", className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      <span className="flex w-4 flex-col items-end gap-1">
        <span className={cn(bar, on ? "w-2" : "w-4 group-hover:w-2")} />
        <span className={cn(bar, on ? "w-4" : "w-2 group-hover:w-4")} />
        <span className={cn(bar, on ? "w-2" : "w-3 group-hover:w-2")} />
      </span>
    </button>
  );
}

function AlertShakeIcon({ className, label = "Warning", onClick, ...props }: IconButtonProps) {
  const controls = useAnimation();
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(base, className)}
      onClick={(e) => {
        onClick?.(e);
        void controls.start({ x: [0, -5, 5, -5, 5, 0], transition: { duration: 0.4, ease: "easeInOut" } });
      }}
      {...props}
    >
      <motion.span animate={controls}>
        <TriangleAlert />
      </motion.span>
    </button>
  );
}

function GlobeIcon({ className, label = "Toggle spin", onClick, ...props }: IconButtonProps) {
  const [spinning, toggle] = useToggle();
  return (
    <button type="button" aria-label={label} aria-pressed={spinning} className={cn(base, className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      <Globe className="animate-spin [animation-duration:2.4s]" style={spinning ? undefined : { animationPlayState: "paused" }} />
    </button>
  );
}

function PaperclipIcon({ className, label = "Attach", onClick, ...props }: IconButtonProps) {
  const [visible, toggle] = useToggle(true);
  return (
    <button type="button" aria-label={label} className={cn(base, className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      <svg {...svgProps}>
        <motion.path
          initial={false}
          animate={{ opacity: visible ? 1 : 0.15, pathLength: visible ? 1 : 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          d="m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551"
        />
      </svg>
    </button>
  );
}

function TrashIcon({ className, label = "Delete", onClick, ...props }: IconButtonProps) {
  const [open, toggle] = useToggle();
  return (
    <button type="button" aria-label={label} className={cn(base, className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      <svg {...svgProps} overflow="visible">
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
        <motion.g initial={false} animate={{ rotate: open ? 30 : 0, y: open ? -2 : 0 }} style={{ transformOrigin: "right" }} transition={{ type: "spring", stiffness: 300, damping: 16 }}>
          <path d="M3 6h18" />
          <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
        </motion.g>
      </svg>
    </button>
  );
}

function SendIcon({ className, label = "Send", onClick, ...props }: IconButtonProps) {
  const controls = useAnimation();
  const busy = React.useRef(false);
  return (
    <button
      type="button"
      aria-label={label}
      className={cn(base, className)}
      onClick={async (e) => {
        onClick?.(e);
        if (busy.current) return;
        busy.current = true;
        await controls.start({ scale: 0.8, x: 0, transition: { duration: 0.18 } });
        await new Promise((r) => setTimeout(r, 160));
        await controls.start({ scale: 0.8, x: 40, transition: { duration: 0.24, ease: "easeIn" } });
        controls.set({ scale: 1, x: -40 });
        await controls.start({ scale: 1, x: 0, transition: { duration: 0.28, ease: [0.05, 0.7, 0.1, 1] } });
        busy.current = false;
      }}
      {...props}
    >
      <motion.span animate={controls} style={{ willChange: "transform" }}>
        <SendHorizonal />
      </motion.span>
    </button>
  );
}

function BellIcon({ className, label = "Toggle notifications", onClick, ...props }: IconButtonProps) {
  const [muted, toggle] = useToggle();
  return (
    <button type="button" aria-label={label} aria-pressed={muted} className={cn(base, className)} onClick={(e) => (toggle(), onClick?.(e))} {...props}>
      <motion.span
        initial={false}
        className="relative flex size-[18px] items-center justify-center"
        animate={{ rotate: muted ? [0, -15, 5, -2, 0] : [0, 20, -15, 12.5, -10, 10, -7.5, 7.5, -5, 5, 0] }}
      >
        <svg width="100%" height="100%" viewBox="0 0 15 17" fill="none">
          <path
            d="M1.18 13.31h12.38c.73 0 1.18-.37 1.18-.94 0-.78-.8-1.48-1.47-2.18-.52-.54-.66-1.65-.72-2.55-.05-3-.85-5.06-2.93-5.81C9.33.8 8.52 0 7.37 0 6.22 0 5.41.8 5.12 1.83 3.04 2.58 2.24 4.64 2.19 7.64c-.06.9-.2 2.01-.72 2.55C.79 10.88 0 11.59 0 12.37c0 .57.44.94 1.18.94Zm6.19 3.14c1.33 0 2.3-.97 2.4-2.06H4.98c.1 1.09 1.07 2.06 2.39 2.06Z"
            fill="currentColor"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="rotate-[-40deg] overflow-hidden">
            <motion.span
              className="block h-[26px]"
              style={{ transformOrigin: "top" }}
              initial={false}
              animate={{ scaleY: muted ? 1 : 0 }}
              transition={{ ease: "easeInOut", duration: muted ? 0.125 : 0.05, delay: muted ? 0.15 : 0 }}
            >
              <span className="bg-background flex h-full w-[3px] justify-center rounded-full">
                <span className="bg-foreground h-full w-[0.75px] rounded-full" />
              </span>
            </motion.span>
          </span>
        </span>
      </motion.span>
    </button>
  );
}

function SpinnerIcon({ size = 20, className, color = "currentColor" }: { size?: number; className?: string; color?: string }) {
  return (
    <output aria-label="Loading" className={cn("relative inline-flex items-center justify-center", className)} style={{ width: size, height: size }}>
      {Array.from({ length: 12 }).map((_, i) => (
        <span
          key={i}
          className="absolute rounded-full"
          style={{
            animation: "dx-spinner-fade 1.2s linear infinite",
            animationDelay: `${-1.2 + i * 0.1}s`,
            transform: `rotate(${i * 30}deg) translate(146%)`,
            background: color,
            height: "8%",
            width: "24%",
          }}
        />
      ))}
    </output>
  );
}

/** Chevron that grows a shaft on hover. */
function ArrowIcon({ className, label = "Next", ...props }: IconButtonProps) {
  return (
    <button type="button" aria-label={label} className={cn(base, "group", className)} {...props}>
      <span className="relative grid items-center">
        <svg {...svgProps} className="transition-transform duration-500 ease-out group-hover:translate-x-0.5">
          <path d="m9 18 6-6-6-6" />
        </svg>
        <span className="absolute right-[6px] h-[2px] w-2.5 origin-right scale-x-0 rounded-[1px] bg-current transition-all duration-300 ease-out group-hover:right-[4px] group-hover:scale-x-100" />
      </span>
    </button>
  );
}

/** Speaker with a slash that wipes in when muted. */
function VolumeIcon({
  className,
  label = "Mute",
  muted: mutedProp,
  onMutedChange,
  onClick,
  ...props
}: IconButtonProps & { muted?: boolean; onMutedChange?: (muted: boolean) => void }) {
  const [inner, setInner] = React.useState(false);
  const muted = mutedProp ?? inner;
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={muted}
      className={cn(base, className)}
      onClick={(e) => {
        setInner(!muted);
        onMutedChange?.(!muted);
        onClick?.(e);
      }}
      {...props}
    >
      <motion.span initial={false} animate={{ rotate: muted ? [0, -15, 5, -2, 0] : 0 }} className="relative flex size-5 items-center justify-center">
        <svg {...svgProps} className="!size-5">
          <path fill="currentColor" stroke="none" d="M11 4.702a.705.705 0 0 0-1.203-.498L6.413 7.587A1.4 1.4 0 0 1 5.416 8H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2.416a1.4 1.4 0 0 1 .997.413l3.383 3.384A.705.705 0 0 0 11 19.298z" />
          <path d="M16 9a5 5 0 0 1 0 6" />
          <path d="M19.364 18.364a9 9 0 0 0 0-12.728" />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center">
          <span className="rotate-[-40deg] overflow-hidden">
            <motion.span
              initial={false}
              animate={{ scaleY: muted ? 1 : 0 }}
              transition={{ ease: "easeInOut", duration: muted ? 0.125 : 0.05, delay: muted ? 0.15 : 0 }}
              style={{ transformOrigin: "top" }}
              className="flex h-[20px] w-fit rounded-full"
            >
              <span className="flex h-full w-[4px] items-center justify-center rounded-full bg-background">
                <span className="h-full w-[2px] rounded-full bg-foreground" />
              </span>
            </motion.span>
          </span>
        </span>
      </motion.span>
    </button>
  );
}

export {
  AlertShakeIcon,
  ArrowIcon,
  BadgeDollarIcon,
  BellIcon,
  ChevronIcon,
  CodeIcon,
  CopyIcon,
  GlobeIcon,
  InfoIcon,
  LockIcon,
  LogoutIcon,
  MenuIcon,
  PaperclipIcon,
  PlusMinusIcon,
  SendIcon,
  SidebarIcon,
  SpinnerIcon,
  TrashIcon,
  VolumeIcon,
  WaveformIcon,
};
export type { IconButtonProps };
