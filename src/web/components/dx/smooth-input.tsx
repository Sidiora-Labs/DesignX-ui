import * as React from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * SmoothInputa text input whose caret glides between positions on a spring.
 *
 */

type SmoothInputProps = Omit<React.ComponentProps<"input">, "type" | "size"> & {
  type?: "text" | "password" | "email" | "search";
  wrapperClassName?: string;
  size?: "default" | "lg" | "xl";
  spring?: { stiffness?: number; damping?: number; mass?: number };
};

const PASSWORD_CHAR =
  typeof navigator !== "undefined" && /firefox|fxios/i.test(navigator.userAgent) ? "●" : "•";

const sizes = {
  default: { wrap: "text-[15px] rounded-md", input: "h-11 px-4" },
  lg: { wrap: "text-lg rounded-lg", input: "h-14 px-5" },
  xl: { wrap: "text-[28px] tracking-[-0.02em] rounded-xl", input: "h-20 px-6" },
};

function SmoothInput({
  className,
  wrapperClassName,
  value,
  defaultValue,
  onChange,
  onBlur,
  type = "text",
  size = "default",
  spring = { stiffness: 500, damping: 30, mass: 0.5 },
  ...props
}: SmoothInputProps) {
  const [internal, setInternal] = React.useState(String(defaultValue ?? ""));
  const caretX = useMotionValue(0);
  const caretOpacity = useMotionValue(0);
  const reduce = useReducedMotion();
  const springX = useSpring(caretX, reduce ? { stiffness: 10000, damping: 100, mass: 0.1 } : spring);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const measureRef = React.useRef<HTMLSpanElement>(null);

  const controlled = value !== undefined;
  const current = controlled ? String(value) : internal;

  const update = React.useCallback(
    (el: HTMLInputElement) => {
      const span = measureRef.current;
      if (!span) return;
      const s = window.getComputedStyle(el);
      span.style.font = `${s.fontStyle} ${s.fontWeight} ${s.fontSize} ${s.fontFamily}`;
      span.style.letterSpacing = s.letterSpacing;
      span.style.fontFeatureSettings = s.fontFeatureSettings;
      const start = el.selectionStart ?? 0;
      const end = el.selectionEnd ?? 0;
      const idx = start === end ? start : el.selectionDirection === "backward" ? start : end;
      const before = el.type === "password" ? PASSWORD_CHAR.repeat(idx) : el.value.slice(0, idx);
      span.textContent = before;
      const pl = parseFloat(s.paddingLeft) || 0;
      const pr = parseFloat(s.paddingRight) || 0;
      const abs = before.length ? span.offsetWidth + pl : pl - 1;
      const visibleRight = el.scrollLeft + el.clientWidth - pr;
      if (abs > visibleRight) el.scrollLeft = abs - el.clientWidth + pr;
      else if (abs < el.scrollLeft + pl) el.scrollLeft = Math.max(0, abs - pl);
      const pos = abs - el.scrollLeft;
      const maxX = el.clientWidth - pr;
      caretX.set(Math.min(pos, maxX));
      caretOpacity.set(start !== end || pos < pl - 1 || pos > maxX + 1 ? 0 : 1);
    },
    [caretX, caretOpacity],
  );

  React.useEffect(() => {
    const el = inputRef.current;
    if (el && document.activeElement === el) update(el);
  }, [current, update]);

  React.useEffect(() => {
    const el = inputRef.current;
    const container = containerRef.current;
    if (!el || !container) return;
    const ifFocused = () => document.activeElement === el && update(el);
    const onSel = () => document.activeElement === el && requestAnimationFrame(ifFocused);
    document.addEventListener("selectionchange", onSel);
    el.addEventListener("scroll", ifFocused);
    void document.fonts?.ready.then(ifFocused);
    const ro = new ResizeObserver(ifFocused);
    ro.observe(container);
    return () => {
      document.removeEventListener("selectionchange", onSel);
      el.removeEventListener("scroll", ifFocused);
      ro.disconnect();
    };
  }, [update]);

  return (
    <div
      data-slot="smooth-input"
      ref={containerRef}
      className={cn(
        "bg-container-high relative grid w-full grid-cols-1 overflow-hidden transition-colors",
        "has-[:focus-visible]:bg-container-higher has-[:focus-visible]:ring-ring/40 has-[:focus-visible]:ring-2",
        "has-[:disabled]:opacity-50",
        sizes[size].wrap,
        wrapperClassName,
      )}
      style={{ caretColor: "transparent" }}
    >
      <input
        {...props}
        ref={inputRef}
        type={type}
        value={current}
        className={cn(
          "placeholder:text-muted-foreground/70 col-start-1 row-start-1 w-full min-w-0 bg-transparent outline-none",
          sizes[size].input,
          className,
        )}
        onChange={(e) => {
          if (!controlled) setInternal(e.target.value);
          onChange?.(e);
          const t = e.target;
          requestAnimationFrame(() => update(t));
        }}
        onBlur={(e) => {
          caretOpacity.set(0);
          onBlur?.(e);
        }}
      />
      <span ref={measureRef} aria-hidden className="pointer-events-none invisible absolute top-0 left-0 whitespace-pre" />
      <motion.div
        aria-hidden
        className="bg-primary pointer-events-none col-start-1 row-start-1 h-[1em] w-[2px] self-center rounded-full"
        style={{ x: springX, opacity: caretOpacity }}
      />
    </div>
  );
}

export { SmoothInput };
export type { SmoothInputProps };
