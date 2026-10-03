import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * AutoscaleInputan amount field that shrinks its type to always fit,
 * with locale-aware digit grouping.
 */

type NumberFormat = "us" | "eu" | "space" | "ch" | "in" | "none" | "string";

const groupSep: Record<NumberFormat, string> = { us: ",", in: ",", eu: ".", space: " ", ch: "'", none: "", string: "" };
const decimalSep = (f: NumberFormat) => (f === "eu" || f === "space" ? "," : ".");

function group(int: string, f: NumberFormat) {
  if (f === "none" || f === "string") return int;
  if (f === "in") {
    if (int.length <= 3) return int;
    const last = int.slice(-3);
    const rest = int.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",");
    return `${rest},${last}`;
  }
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, groupSep[f]);
}

function formatAmount(raw: string, f: NumberFormat) {
  if (f === "string") return raw;
  const dec = decimalSep(f);
  const stripped = groupSep[f] ? raw.split(groupSep[f]).join("") : raw;
  const idx = stripped.lastIndexOf(dec);
  const int = (idx === -1 ? stripped : stripped.slice(0, idx)).replace(/\D/g, "").replace(/^0+(?=\d)/, "");
  const frac = idx === -1 ? "" : stripped.slice(idx + 1).replace(/\D/g, "");
  if (!int && !frac && idx === -1) return "";
  const head = group(int || "0", f);
  return idx === -1 ? head : `${head}${dec}${frac}`;
}

/** Parses a formatted string back to a number (NaN for empty / string format). */
function parseAmount(formatted: string, f: NumberFormat) {
  if (f === "string" || !formatted) return Number.NaN;
  const stripped = groupSep[f] ? formatted.split(groupSep[f]).join("") : formatted;
  return Number(stripped.replace(decimalSep(f), "."));
}

type AutoscaleInputProps = Omit<React.ComponentProps<"input">, "value" | "defaultValue" | "onChange" | "prefix"> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (formatted: string, numeric: number) => void;
  numberFormat?: NumberFormat;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
  minSize?: number;
  maxSize?: number;
  wrapperClassName?: string;
};

function AutoscaleInput({
  value,
  defaultValue = "",
  onValueChange,
  numberFormat = "us",
  prefix = "$",
  suffix,
  minSize = 18,
  maxSize = 96,
  placeholder,
  className,
  wrapperClassName,
  ...props
}: AutoscaleInputProps) {
  const [internal, setInternal] = React.useState(() => formatAmount(defaultValue, numberFormat));
  const controlled = value !== undefined;
  const current = controlled ? value : internal;
  const ph = placeholder ?? (numberFormat === "string" ? "Type here…" : `0${decimalSep(numberFormat)}00`);

  const wrapRef = React.useRef<HTMLDivElement>(null);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const preRef = React.useRef<HTMLSpanElement>(null);
  const sufRef = React.useRef<HTMLSpanElement>(null);
  const [size, setSize] = React.useState(maxSize);

  const fit = React.useCallback(() => {
    const wrap = wrapRef.current;
    const el = inputRef.current;
    if (!wrap || !el) return;
    const available = wrap.clientWidth;
    const restore = el.value;
    if (!restore) el.value = ph;
    const apply = (n: number) => {
      const px = `${n}px`;
      el.style.fontSize = px;
      if (preRef.current) preRef.current.style.fontSize = px;
      if (sufRef.current) sufRef.current.style.fontSize = px;
    };
    const measure = () => (preRef.current?.offsetWidth ?? 0) + el.scrollWidth + (sufRef.current?.offsetWidth ?? 0);
    let lo = minSize;
    let hi = maxSize;
    while (hi - lo > 0.5) {
      const mid = (lo + hi) / 2;
      apply(mid);
      if (measure() > available) hi = mid;
      else lo = mid;
    }
    const final = Math.floor(lo);
    apply(final);
    el.value = restore;
    setSize(final);
  }, [minSize, maxSize, ph]);

  React.useLayoutEffect(fit, [fit, current, prefix, suffix]);
  React.useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(fit);
    ro.observe(wrap);
    void document.fonts?.ready.then(fit);
    return () => ro.disconnect();
  }, [fit]);

  const empty = !current;
  const style = { fontSize: size };

  return (
    // oxlint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events -- click forwards focus to the inner input
    <div
      data-slot="autoscale-input"
      ref={wrapRef}
      onClick={() => inputRef.current?.focus()}
      className={cn(
        "relative flex w-full cursor-text items-center justify-center overflow-hidden text-center leading-[1.1] font-medium tracking-[-0.04em] tabular-nums",
        wrapperClassName,
      )}
    >
      {prefix != null && (
        <span ref={preRef} style={style} className={cn("shrink-0 transition-colors", empty && "text-muted-foreground/30")}>
          {prefix}
        </span>
      )}
      <input
        {...props}
        ref={inputRef}
        type="text"
        autoComplete="off"
        inputMode={numberFormat === "string" ? "text" : "decimal"}
        value={current}
        placeholder={ph}
        style={style}
        onChange={(e) => {
          const next = formatAmount(e.target.value, numberFormat);
          if (!controlled) setInternal(next);
          onValueChange?.(next, parseAmount(next, numberFormat));
        }}
        className={cn(
          "caret-primary placeholder:text-muted-foreground/30 min-w-0 bg-transparent p-0 text-center outline-none [field-sizing:content]",
          className,
        )}
      />
      {suffix != null && (
        <span ref={sufRef} style={style} className={cn("shrink-0 whitespace-nowrap transition-colors", empty && "text-muted-foreground/30")}>
          {suffix}
        </span>
      )}
    </div>
  );
}

export { AutoscaleInput, formatAmount, parseAmount };
export type { AutoscaleInputProps, NumberFormat };
