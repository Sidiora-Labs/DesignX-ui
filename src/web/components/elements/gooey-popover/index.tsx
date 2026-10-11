import { cn } from "@/lib/utils";
import { animate, type AnimationPlaybackControlsWithThen as AnimationPlaybackControls } from "motion/react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useClickOutside } from "./use-click-outside";

const MEASURE_DELAY_SHORT = 100;
const MEASURE_DELAY_LONG = 500;
const DEFAULT_TRIGGER_SIZE = 44;
const DEFAULT_CONTENT_WIDTH = 240;
const DEFAULT_SIDE_OFFSET = 24;
const DEFAULT_SPEED = 0.25;
const GOO_STD_DEVIATION = 10;
const GOO_MATRIX_ALPHA_MULTIPLIER = 24;
const GOO_MATRIX_ALPHA_OFFSET = -10;
const CONTENT_BORDER_RADIUS = 18;

export type GooeyPopoverProps = {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  /**
   * Accessible name for the trigger. Required when `trigger` renders no text
   * of its own; the default plus icon falls back to "Open popover".
   */
  triggerLabel?: string;
  triggerSize?: number;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  side?: "top" | "bottom";
  sideOffset?: number;
  contentWidth?: number;
  speed?: number;
  bgClassName?: string;
  contentClassName?: string;
  className?: string;
};

export default function GooeyPopover({
  children,
  trigger,
  triggerLabel,
  triggerSize = DEFAULT_TRIGGER_SIZE,
  isOpen: controlledIsOpen,
  onOpenChange,
  side = "top",
  sideOffset = DEFAULT_SIDE_OFFSET,
  contentWidth = DEFAULT_CONTENT_WIDTH,
  speed = DEFAULT_SPEED,
  bgClassName = "bg-foreground",
  contentClassName,
  className,
}: GooeyPopoverProps) {
  const filterId = useId();
  const isControlled = controlledIsOpen !== undefined;
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = isControlled ? controlledIsOpen : internalIsOpen;
  const [isVisible, setIsVisible] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const measureRef = useRef<HTMLDivElement>(null);
  const filteredContentRef = useRef<HTMLDivElement>(null);
  const unfilteredContentRef = useRef<HTMLDivElement>(null);
  const innerContentRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<AnimationPlaybackControls[]>([]);
  const [contentHeight, setContentHeight] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) {
        setInternalIsOpen(open);
      }
      onOpenChange?.(open);
    },
    [isControlled, onOpenChange]
  );

  const handleClose = useCallback(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [isOpen, setIsOpen]);

  useClickOutside(containerRef, handleClose);

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, setIsOpen]);

  // Measure content height
  useEffect(() => {
    const measureHeight = () => {
      if (measureRef.current) {
        const height = measureRef.current.scrollHeight;
        if (height > 0) {
          setContentHeight(height);
        }
      }
    };

    const timeoutId = setTimeout(measureHeight, MEASURE_DELAY_SHORT);
    const timeoutId2 = setTimeout(measureHeight, MEASURE_DELAY_LONG);
    return () => {
      clearTimeout(timeoutId);
      clearTimeout(timeoutId2);
    };
  }, [children]);

  const triggerRadius = triggerSize / 2;
  // Position content so its edge clears the trigger with sideOffset gap
  const translateY =
    side === "top" ? -(contentHeight + sideOffset) : triggerSize + sideOffset;
  const contentLeft = triggerRadius - contentWidth / 2;

  // Shape-morph animations
  useEffect(() => {
    if (contentHeight === 0) {
      return;
    }

    const stopAll = () => {
      for (const c of timelineRef.current) {
        c.stop();
      }
      timelineRef.current = [];
    };
    stopAll();

    const filteredTarget = filteredContentRef.current;
    const unfilteredTarget = unfilteredContentRef.current;
    const innerTarget = innerContentRef.current;

    if (!(unfilteredTarget && innerTarget)) {
      return;
    }

    const EASE_IN: [number, number, number, number] = [0.55, 0.085, 0.68, 0.53];
    const EASE_OUT: [number, number, number, number] = [0.25, 0.46, 0.45, 0.94];
    const set = (el: HTMLElement, props: Record<string, number>) => {
      timelineRef.current.push(animate(el, props, { duration: 0 }));
    };
    const to = (
      el: HTMLElement,
      props: Record<string, number>,
      opts: { duration: number; delay?: number; ease: [number, number, number, number] },
    ) => {
      const c = animate(el, props, opts);
      timelineRef.current.push(c);
      return c;
    };

    const openShape = {
      borderRadius: CONTENT_BORDER_RADIUS,
      height: contentHeight,
      width: contentWidth,
      x: contentLeft,
      y: translateY,
    };
    const circle = {
      borderRadius: triggerRadius,
      height: triggerSize,
      width: triggerSize,
      x: 0,
      y: 0,
    };

    if (prefersReducedMotion) {
      if (isOpen) {
        setIsVisible(true);
        set(unfilteredTarget, { ...openShape, opacity: 1 });
        set(innerTarget, { opacity: 1, y: 0 });
      } else {
        set(unfilteredTarget, { ...circle, opacity: 0 });
        set(innerTarget, { opacity: 0, y: 0 });
        setIsVisible(false);
      }
      return stopAll;
    }

    if (isOpen) {
      setIsVisible(true);
      const startProps = { ...circle, opacity: 1 };
      if (filteredTarget) {
        set(filteredTarget, startProps);
        // Filtered shape morphs with square corners; the goo filter softens them.
        to(filteredTarget, { ...openShape, borderRadius: 0 }, { duration: speed, ease: EASE_IN });
      }
      set(unfilteredTarget, startProps);
      set(innerTarget, { opacity: 0, y: 16 });
      to(unfilteredTarget, openShape, { duration: speed, ease: EASE_IN });
      to(innerTarget, { opacity: 1, y: 0 }, { delay: speed * 0.575, duration: speed * 0.75, ease: EASE_OUT });
    } else {
      to(innerTarget, { opacity: 0, y: 8 }, { duration: speed * 0.4, ease: EASE_IN });
      const targets = [filteredTarget, unfilteredTarget].filter(
        (t): t is HTMLDivElement => Boolean(t),
      );
      let last: AnimationPlaybackControls | null = null;
      for (const t of targets) {
        to(t, circle, { delay: speed * 0.2, duration: speed, ease: EASE_IN });
        last = to(t, { opacity: 0 }, { delay: speed * 0.9, duration: speed * 0.3, ease: EASE_IN });
      }
      if (last) {
        void last.finished.then(() => setIsVisible(false));
      } else {
        setIsVisible(false);
      }
    }

    return stopAll;
  }, [
    isOpen,
    contentHeight,
    contentWidth,
    triggerSize,
    triggerRadius,
    contentLeft,
    translateY,
    speed,
    prefersReducedMotion,
  ]);

  const defaultTriggerIcon = (
    <svg
      aria-hidden="true"
      fill="none"
      height={20}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      viewBox="0 0 24 24"
      width={20}
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="12" x2="12" y1="5" y2="19" />
      <line x1="5" x2="19" y1="12" y2="12" />
    </svg>
  );

  return (
    <div className={cn("relative inline-flex", className)} ref={containerRef}>
      {/* SVG goo filter definition */}
      <svg
        aria-hidden="true"
        className="absolute"
        style={{ height: 0, width: 0 }}
      >
        <defs>
          <filter id={filterId}>
            <feGaussianBlur
              in="SourceGraphic"
              result="blur"
              stdDeviation={GOO_STD_DEVIATION}
            />
            <feColorMatrix
              in="blur"
              result="goo"
              type="matrix"
              values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${String(GOO_MATRIX_ALPHA_MULTIPLIER)} ${String(GOO_MATRIX_ALPHA_OFFSET)}`}
            />
            <feComposite in="SourceGraphic" in2="goo" operator="atop" />
          </filter>
        </defs>
      </svg>

      {/* Hidden measurement div */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute"
        ref={measureRef}
        style={{
          left: -9999,
          position: "absolute",
          top: -9999,
          visibility: "hidden",
          width: contentWidth,
        }}
      >
        <div className={cn("p-4", contentClassName)}>{children}</div>
      </div>

      {/* Filtered layer: SVG goo filter creates liquid bridge between blob and content */}
      {!prefersReducedMotion && (isOpen || isVisible) && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
          style={{ filter: `url(#${filterId})` }}
        >
          {/* Blob: circle at trigger position — stays put while content morphs away */}
          <div
            className={cn("absolute rounded-full", bgClassName)}
            style={{
              height: triggerSize,
              left: 0,
              top: 0,
              width: triggerSize,
            }}
          />

          {/* Content shape: morphs from circle to rectangle (borderRadius=0, goo softens edges) */}
          <div
            className={cn("absolute", bgClassName)}
            ref={filteredContentRef}
            style={{
              borderRadius: triggerRadius,
              height: triggerSize,
              left: 0,
              opacity: 0,
              top: 0,
              width: triggerSize,
            }}
          />
        </div>
      )}

      {/* Trigger button (z-10, sits on top of filtered blob) */}
      <button
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-label={triggerLabel ?? (trigger ? undefined : "Open popover")}
        className={cn(
          "relative z-10 flex cursor-pointer items-center justify-center rounded-full text-background transition-colors",
          bgClassName
        )}
        onClick={() => setIsOpen(!isOpen)}
        style={{
          height: triggerSize,
          width: triggerSize,
        }}
        type="button"
      >
        {trigger ?? defaultTriggerIcon}
      </button>

      {/* Unfiltered content panel (z-10, clean edges, actual text) */}
      {isOpen || isVisible ? (
        <div
          className={cn(
            "absolute z-10 overflow-hidden text-background",
            bgClassName
          )}
          ref={unfilteredContentRef}
          // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role
          role="dialog"
          style={{
            borderRadius: triggerRadius,
            height: triggerSize,
            left: 0,
            opacity: 0,
            top: 0,
            width: triggerSize,
          }}
        >
          <div
            className={cn("p-4", contentClassName)}
            ref={innerContentRef}
            style={{ opacity: 0, transform: "translateY(16px)" }}
          >
            {children}
          </div>
        </div>
      ) : null}
    </div>
  );
}
