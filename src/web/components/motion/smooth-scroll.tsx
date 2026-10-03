import { type MotionValue, useMotionValue, useReducedMotion } from "motion/react";
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from "react";

// Expo-out curve for programmatic scrolls.
const EASE_SCROLL = (t: number) => Math.min(1, 1.001 - 2 ** (-10 * t));

export type ScrollTarget = number | string | HTMLElement;

export type ScrollToOptions = {
  offset?: number;
  immediate?: boolean;
  duration?: number;
};

export type SmoothScrollApi = {
  /** Reserved for a third-party scroll engine; always null in DX UI. */
  lenis: null;
  /** Current scroll offset in px. */
  scrollY: MotionValue<number>;
  /** Scroll position as 0..1 of the scrollable height. */
  progress: MotionValue<number>;
  /** Signed scroll velocity (px/frame); drives velocity-based effects. */
  velocity: MotionValue<number>;
  /** Programmatic smooth scroll. Respects reduced motion (jumps instantly). */
  scrollTo: (target: ScrollTarget, options?: ScrollToOptions) => void;
};

const SmoothScrollContext = createContext<SmoothScrollApi | null>(null);

export interface SmoothScrollProps {
  children: ReactNode;
  /** Drive the page (window) when true, or a contained scroll area when false. */
  root?: boolean;
  /** Smoothing factor; lower is smoother and heavier. */
  lerp?: number;
  /** Wheel / programmatic ease duration in seconds. */
  duration?: number;
  orientation?: "vertical" | "horizontal";
  /** Wheel scroll speed multiplier. */
  wheelMultiplier?: number;
  /** Smooth touch scrolling. Off by defaultnative momentum is good on mobile. */
  touch?: boolean;
  className?: string;
}

type ScrollSource = Window | HTMLElement;

function readMetrics(target: ScrollSource) {
  if (target instanceof Window) {
    const max = Math.max(
      0,
      document.documentElement.scrollHeight - window.innerHeight,
    );
    return { y: window.scrollY, max };
  }
  return {
    y: target.scrollTop,
    max: Math.max(0, target.scrollHeight - target.clientHeight),
  };
}

function resolveTop(
  target: ScrollTarget,
  source: ScrollSource,
  offset = 0,
): number {
  if (typeof target === "number") return target + offset;
  if (source instanceof Window) {
    const el =
      typeof target === "string" ? document.querySelector(target) : target;
    if (!el) return window.scrollY;
    return el.getBoundingClientRect().top + window.scrollY + offset;
  }
  const el =
    typeof target === "string" ? source.querySelector(target) : target;
  if (!(el instanceof HTMLElement)) return source.scrollTop;
  return el.offsetTop + offset;
}

type Engine = {
  scrollTo: (top: number, opts?: { duration?: number; immediate?: boolean }) => void;
  destroy: () => void;
};

/**
 * Minimal wheel smoother: intercepts wheel deltas, lerps the scroll position
 * toward an accumulated target each frame, and eases programmatic scrolls.
 * Touch and keyboard keep native behaviour.
 */
function createEngine(
  source: ScrollSource,
  opts: { lerp: number; wheelMultiplier: number; horizontal: boolean },
): Engine {
  const el = source instanceof Window ? document.documentElement : source;
  const read = () =>
    opts.horizontal
      ? source instanceof Window ? window.scrollX : source.scrollLeft
      : source instanceof Window ? window.scrollY : source.scrollTop;
  const maxOf = () =>
    opts.horizontal
      ? el.scrollWidth - (source instanceof Window ? window.innerWidth : el.clientWidth)
      : el.scrollHeight - (source instanceof Window ? window.innerHeight : el.clientHeight);
  const write = (v: number) => {
    if (opts.horizontal) source.scrollTo({ left: v, behavior: "instant" });
    else source.scrollTo({ top: v, behavior: "instant" });
  };
  let target = read();
  let current = target;
  let raf = 0;
  let tween: { from: number; to: number; start: number; dur: number } | null = null;

  const tick = (now: number) => {
    if (tween) {
      const t = Math.min(1, (now - tween.start) / tween.dur);
      current = tween.from + (tween.to - tween.from) * EASE_SCROLL(t);
      write(current);
      if (t >= 1) {
        tween = null;
        target = current;
        raf = 0;
        return;
      }
    } else {
      current += (target - current) * opts.lerp;
      if (Math.abs(target - current) < 0.5) current = target;
      write(current);
      if (current === target) {
        raf = 0;
        return;
      }
    }
    raf = requestAnimationFrame(tick);
  };
  const run = () => {
    if (!raf) raf = requestAnimationFrame(tick);
  };
  const onWheel = (e: WheelEvent) => {
    if (e.ctrlKey) return;
    const max = Math.max(0, maxOf());
    if (max <= 0) return;
    const delta = (opts.horizontal ? e.deltaX || e.deltaY : e.deltaY) * opts.wheelMultiplier;
    const scale = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? max : 1;
    if (!raf) current = read();
    const next = Math.min(max, Math.max(0, target + delta * scale));
    if (next === target && (next === 0 || next === max)) return;
    e.preventDefault();
    tween = null;
    target = next;
    run();
  };
  const onScroll = () => {
    if (!raf) target = current = read();
  };
  const listenOn: Window | HTMLElement = source;
  listenOn.addEventListener("wheel", onWheel as EventListener, { passive: false });
  listenOn.addEventListener("scroll", onScroll, { passive: true });
  return {
    scrollTo(top, o) {
      const max = Math.max(0, maxOf());
      const to = Math.min(max, Math.max(0, top));
      if (o?.immediate) {
        cancelAnimationFrame(raf);
        raf = 0;
        tween = null;
        target = current = to;
        write(to);
        return;
      }
      current = read();
      tween = { from: current, to, start: performance.now(), dur: (o?.duration ?? 1.2) * 1000 };
      run();
    },
    destroy() {
      cancelAnimationFrame(raf);
      listenOn.removeEventListener("wheel", onWheel as EventListener);
      listenOn.removeEventListener("scroll", onScroll);
    },
  };
}

/** Native scroll listener for the reduced-motion path and the no-provider fallback. */
function useNativeScrollSync(
  enabled: boolean,
  getTarget: () => ScrollSource | null,
  scrollY: MotionValue<number>,
  progress: MotionValue<number>,
  velocity: MotionValue<number>,
) {
  useEffect(() => {
    if (!enabled) return;
    const target = getTarget();
    if (!target) return;
    let lastY = readMetrics(target).y;
    let lastT = performance.now();
    const onScroll = () => {
      const { y, max } = readMetrics(target);
      const now = performance.now();
      const dt = now - lastT || 16;
      scrollY.set(y);
      progress.set(max > 0 ? y / max : 0);
      velocity.set(((y - lastY) / dt) * 16);
      lastY = y;
      lastT = now;
    };
    onScroll();
    target.addEventListener("scroll", onScroll, { passive: true });
    return () => target.removeEventListener("scroll", onScroll);
  }, [enabled, getTarget, scrollY, progress, velocity]);
}

export function SmoothScroll({
  children,
  root = true,
  lerp = 0.1,
  duration = 1.2,
  orientation = "vertical",
  wheelMultiplier = 1,
  className,
}: SmoothScrollProps) {
  const reduce = useReducedMotion();
  const scrollY = useMotionValue(0);
  const progress = useMotionValue(0);
  const velocity = useMotionValue(0);
  const engineRef = useRef<Engine | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const nativeSource = useCallback(
    (): ScrollSource | null => (root ? window : containerRef.current),
    [root],
  );

  useEffect(() => {
    if (reduce) return;
    const source = nativeSource();
    if (!source) return;
    const engine = createEngine(source, {
      lerp,
      wheelMultiplier,
      horizontal: orientation === "horizontal",
    });
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [reduce, nativeSource, lerp, wheelMultiplier, orientation]);

  const scrollTo = useCallback(
    (target: ScrollTarget, options?: ScrollToOptions) => {
      const source = nativeSource() ?? window;
      const top = resolveTop(target, source, options?.offset);
      const engine = engineRef.current;
      if (engine && !reduce) {
        engine.scrollTo(top, {
          duration: options?.duration ?? duration,
          immediate: options?.immediate,
        });
        return;
      }
      const behavior = reduce || options?.immediate ? "auto" : "smooth";
      source.scrollTo({ top, behavior });
    },
    [reduce, nativeSource, duration],
  );

  useNativeScrollSync(true, nativeSource, scrollY, progress, velocity);

  const api = useMemo<SmoothScrollApi>(
    () => ({ lenis: null, scrollY, progress, velocity, scrollTo }),
    [scrollY, progress, velocity, scrollTo],
  );

  return (
    <SmoothScrollContext.Provider value={api}>
      <div
        ref={containerRef}
        className={className}
        style={root ? undefined : { overflow: "auto" }}
      >
        {children}
      </div>
    </SmoothScrollContext.Provider>
  );
}

/**
 * Read the page's smooth-scroll state. Inside <SmoothScroll> it returns the
 * shared motion values; outside it falls back to a native window scroll
 * listener so scroll-driven components still work without the provider.
 */
export function useSmoothScroll(): SmoothScrollApi {
  const ctx = useContext(SmoothScrollContext);
  const scrollY = useMotionValue(0);
  const progress = useMotionValue(0);
  const velocity = useMotionValue(0);

  const windowSource = useCallback((): ScrollSource => window, []);
  useNativeScrollSync(ctx === null, windowSource, scrollY, progress, velocity);

  const scrollTo = useCallback((target: ScrollTarget, options?: ScrollToOptions) => {
    window.scrollTo({
      top: resolveTop(target, window, options?.offset),
      behavior: options?.immediate ? "auto" : "smooth",
    });
  }, []);

  const fallback = useMemo<SmoothScrollApi>(
    () => ({ lenis: null, scrollY, progress, velocity, scrollTo }),
    [scrollY, progress, velocity, scrollTo],
  );

  return ctx ?? fallback;
}
