import * as React from "react";
import {
  animate,
  type MotionValue,
  motion,
  useMotionValue,
  useMotionValueEvent,
  useTransform,
} from "motion/react";

import { cn } from "@/lib/utils";

/**
 * Scrubberan elastic timeline slider that swells on hover, stretches past
 * its ends with rubber-band resistance, and shows a hover time readout.
 * MediaScrubber wires it to a <video>.
 */

const MAX_OVERFLOW = 50;

function decay(value: number, max: number) {
  if (max === 0) return 0;
  const entry = value / max;
  return 2 * (1 / (1 + Math.exp(-entry)) - 0.5) * max;
}

function formatTime(value: number) {
  if (!Number.isFinite(value) || value < 0) return "0:00";
  const s = Math.floor(value);
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}

type ScrubberProps = {
  value: MotionValue<number>;
  max: MotionValue<number>;
  onChange: (next: number) => void;
  onScrubStart?: () => void;
  onScrubEnd?: () => void;
  format?: (v: number) => string;
  showLabels?: boolean;
  className?: string;
};

function Scrubber({ value, max, onChange, onScrubStart, onScrubEnd, format = formatTime, showLabels = true, className }: ScrubberProps) {
  const trackRef = React.useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = React.useState(false);
  const [labels, setLabels] = React.useState({ cur: format(0), max: format(0), hover: format(0) });

  const region = useMotionValue(0);
  const caretX = useMotionValue(0);
  const overflow = useMotionValue(0);
  const scale = useMotionValue(0.8);
  const caretOpacity = useMotionValue(0);
  const pct = useMotionValue(0);

  const sync = () => {
    const m = max.get();
    pct.set(m ? Math.min(Math.max((value.get() / m) * 100, 0), 100) : 0);
  };
  useMotionValueEvent(value, "change", (v) => {
    sync();
    setLabels((l) => ({ ...l, cur: format(v) }));
  });
  useMotionValueEvent(max, "change", (v) => {
    sync();
    setLabels((l) => ({ ...l, max: format(v) }));
  });
  React.useEffect(() => {
    sync();
    setLabels((l) => ({ ...l, cur: format(value.get()), max: format(max.get()) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const scaleX = useTransform(overflow, (ov) => {
    const w = trackRef.current?.getBoundingClientRect().width;
    return w ? 1 + ov / w : 1;
  });
  const scaleY = useTransform(overflow, [0, MAX_OVERFLOW], [1, 0.8]);
  const origin = useTransform(region, (r) => (r < 0 ? "right" : r > 0 ? "left" : "center"));
  const height = useTransform(scale, [0.8, 1], [6, 26]);
  const opacity = useTransform(scale, [0.8, 1], [0.75, 1]);
  const clip = useTransform(pct, (p) => `inset(0 ${100 - p}% 0 0)`);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return;
    const { left, right, width } = track.getBoundingClientRect();
    let x: number;
    if (e.clientX < left) {
      region.set(-1);
      overflow.jump(decay(left - e.clientX, MAX_OVERFLOW));
      x = -overflow.get();
    } else if (e.clientX > right) {
      region.set(1);
      overflow.jump(decay(e.clientX - right, MAX_OVERFLOW));
      x = width + overflow.get();
    } else {
      region.set(0);
      overflow.jump(0);
      x = e.clientX - left;
    }
    caretX.set(x);
    const m = max.get();
    if (m) setLabels((l) => ({ ...l, hover: format((Math.min(Math.max(x / width, 0), 1)) * m) }));
    if (e.buttons > 0 && m) onChange(((Math.min(Math.max(e.clientX, left), right) - left) / width) * m);
  };
  const release = () => {
    animate(overflow, 0, { type: "spring", bounce: 0.5 });
    region.set(0);
  };

  return (
    <div data-slot="scrubber" className={cn("w-full", className)}>
      <div className="relative flex h-10 items-center">
        <motion.div
          onPointerMove={onMove}
          onPointerLeave={release}
          onHoverStart={() => {
            setHovered(true);
            animate(scale, 1);
            animate(caretOpacity, 1);
          }}
          onHoverEnd={() => {
            setHovered(false);
            animate(scale, 0.8);
            animate(caretOpacity, 0);
          }}
          style={{ scale, opacity }}
          className="relative flex h-16 w-full cursor-grab touch-none items-center active:cursor-grabbing"
        >
          <div
            ref={trackRef}
            // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
            role="slider"
            tabIndex={0}
            aria-label="Seek"
            aria-valuemin={0}
            aria-valuemax={Math.round(max.get())}
            aria-valuenow={Math.round(value.get())}
            aria-valuetext={labels.cur}
            onKeyDown={(e) => {
              const step = (max.get() || 0) / 20;
              if (e.key === "ArrowRight") onChange(Math.min(value.get() + step, max.get()));
              if (e.key === "ArrowLeft") onChange(Math.max(value.get() - step, 0));
            }}
            onPointerDown={(e) => {
              onScrubStart?.();
              onMove(e);
              e.currentTarget.setPointerCapture(e.pointerId);
            }}
            onPointerUp={() => {
              release();
              onScrubEnd?.();
            }}
            className="focus-ring absolute flex w-full items-center rounded-lg py-4"
          >
            <motion.div style={{ scaleX, scaleY, transformOrigin: origin, height, marginBlock: -3 }} className="flex grow">
              <div className="bg-container-higher relative h-full grow overflow-hidden rounded-lg">
                <motion.div style={{ clipPath: clip }} className="bg-foreground/85 absolute inset-0" />
              </div>
            </motion.div>
          </div>
        </motion.div>
        <motion.div
          aria-hidden
          style={{ opacity: caretOpacity, x: caretX }}
          className="border-info pointer-events-none absolute left-0 flex h-10 w-px items-start justify-center border-r"
        >
          <span className="bg-popover text-info shadow-float absolute -top-1 -translate-y-full rounded-xs px-1 py-0.5 font-mono text-[10px] leading-none">
            {labels.hover}
          </span>
        </motion.div>
      </div>
      {showLabels && (
        <motion.div
          animate={{ y: hovered ? 8 : -26, opacity: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.24, ease: "easeOut" }}
          className="text-muted-foreground pointer-events-none flex justify-between font-mono text-xs tabular-nums"
        >
          <span>{labels.cur}</span>
          <span>{labels.max}</span>
        </motion.div>
      )}
    </div>
  );
}

type MediaScrubberProps = Omit<React.ComponentProps<"video">, "ref"> & { wrapperClassName?: string };

function MediaScrubber({ className, wrapperClassName, ...videoProps }: MediaScrubberProps) {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const current = useMotionValue(0);
  const duration = useMotionValue(0);
  const wasPlaying = React.useRef(false);
  const scrubbing = React.useRef(false);
  const [playing, setPlaying] = React.useState(false);

  React.useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    let raf: number | null = null;
    const tick = () => {
      if (!scrubbing.current) current.set(v.currentTime);
      raf = requestAnimationFrame(tick);
    };
    const meta = () => duration.set(v.duration || 0);
    const play = () => {
      setPlaying(true);
      if (raf === null) raf = requestAnimationFrame(tick);
    };
    const pause = () => {
      setPlaying(false);
      if (raf !== null) cancelAnimationFrame(raf);
      raf = null;
      if (!scrubbing.current) current.set(v.currentTime);
    };
    v.addEventListener("loadedmetadata", meta);
    v.addEventListener("play", play);
    v.addEventListener("pause", pause);
    if (v.readyState >= 1) meta();
    if (!v.paused) play();
    return () => {
      v.removeEventListener("loadedmetadata", meta);
      v.removeEventListener("play", play);
      v.removeEventListener("pause", pause);
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [current, duration]);

  const toggle = () => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  return (
    <div data-slot="media-scrubber" className={cn("flex w-full flex-col gap-4", wrapperClassName)}>
      <div className="group bg-container-high relative overflow-hidden rounded-xl">
        <video ref={videoRef} playsInline muted className={cn("block h-full w-full object-cover", className)} {...videoProps} />
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="absolute inset-0 flex items-center justify-center bg-black/25 opacity-0 transition-opacity duration-300 group-hover:opacity-100 focus-visible:opacity-100"
        >
          <span className="relative flex size-12 items-center justify-center rounded-full bg-white/90 text-black backdrop-blur">
            <motion.svg viewBox="0 0 24 24" className="absolute size-5" animate={{ scale: playing ? 1 : 0 }} transition={{ type: "spring", duration: 0.6, bounce: 0.5 }}>
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </motion.svg>
            <motion.svg viewBox="0 0 24 24" className="absolute ml-0.5 size-5" animate={{ scale: playing ? 0 : 1 }} transition={{ type: "spring", duration: 0.6, bounce: 0.5 }}>
              <path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5Z" fill="currentColor" />
            </motion.svg>
          </span>
        </button>
      </div>
      <Scrubber
        value={current}
        max={duration}
        onScrubStart={() => {
          const v = videoRef.current;
          if (!v) return;
          scrubbing.current = true;
          wasPlaying.current = !v.paused;
          v.pause();
        }}
        onChange={(next) => {
          const v = videoRef.current;
          if (!v) return;
          const safe = Math.min(Math.max(next, 0), duration.get() || 0);
          v.currentTime = safe;
          current.set(safe);
        }}
        onScrubEnd={() => {
          scrubbing.current = false;
          if (wasPlaying.current) void videoRef.current?.play().catch(() => {});
        }}
      />
    </div>
  );
}

export { MediaScrubber, Scrubber, formatTime };
export type { MediaScrubberProps, ScrubberProps };
