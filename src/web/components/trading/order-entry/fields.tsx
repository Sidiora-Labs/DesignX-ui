import { TriangleAlertIcon } from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

/** Keep digits and one decimal point. */
export function cleanNumber(text: string) {
  const s = text.replace(/[^0-9.]/g, "");
  const dot = s.indexOf(".");
  return dot === -1 ? s : s.slice(0, dot + 1) + s.slice(dot + 1).replace(/\./g, "");
}

/** Cap the fraction digits of typed text without reformatting it. */
export function capDecimals(text: string, dp: number) {
  const dot = text.indexOf(".");
  if (dot === -1) return text;
  return dp <= 0 ? text.slice(0, dot) : text.slice(0, dot + 1 + dp);
}

export function num(text: string | undefined | null) {
  if (!text) return null;
  const n = Number(text);
  return Number.isFinite(n) ? n : null;
}

/** A number as plain input text, rounded down to `dp` places with trailing zeros trimmed. */
export function toInput(value: number | null | undefined, dp: number, mode: "floor" | "round" = "round") {
  if (value == null || !Number.isFinite(value) || value <= 0) return "";
  const f = 10 ** dp;
  const v = mode === "floor" ? Math.floor(value * f + 1e-9) / f : Math.round(value * f) / f;
  return v ? v.toFixed(dp).replace(/\.?0+$/, "") : "";
}

export function FieldError({ children }: { children: ReactNode }) {
  return (
    <p className="mt-1 flex items-start gap-1 text-[11px] leading-snug text-destructive">
      <TriangleAlertIcon aria-hidden className="mt-px size-3 shrink-0" />
      <span>{children}</span>
    </p>
  );
}

export interface EntryFieldProps {
  id: string;
  label: ReactNode;
  /** Controls next to the label, e.g. a type switch. */
  labelAddon?: ReactNode;
  /** Unit or controls at the top-right. */
  suffix?: ReactNode;
  /** Controls under the input, e.g. preset chips. */
  footer?: ReactNode;
  error?: ReactNode;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}

/** The order-form input frame: small label on top, value below, unit on the right. */
export function EntryField({ id, label, labelAddon, suffix, footer, error, disabled, className, children }: EntryFieldProps) {
  return (
    <div className={className}>
      <div
        data-invalid={error ? "" : undefined}
        className={cn(
          "flex flex-col gap-1 rounded-lg bg-container-high px-3 pt-1.5 pb-2 ring-inset focus-within:ring-1 focus-within:ring-primary",
          "data-invalid:ring-1 data-invalid:ring-destructive",
          disabled && "opacity-60",
        )}
      >
        <div className="flex min-h-5 items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span className="flex min-w-0 items-center gap-0.5">
            <label htmlFor={id} className="truncate">
              {label}
            </label>
            {labelAddon}
          </span>
          {suffix != null && <span className="flex shrink-0 items-center gap-1.5">{suffix}</span>}
        </div>
        {children}
        {footer}
      </div>
      {error && <FieldError>{error}</FieldError>}
    </div>
  );
}

export const entryInputClass =
  "h-6 w-full min-w-0 bg-transparent font-mono text-sm text-foreground tabular-nums outline-none placeholder:text-muted-foreground/50 disabled:cursor-not-allowed";

/** A row of mutually exclusive pill buttons. */
export function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
  disabled,
  className,
  itemClassName,
}: {
  label: string;
  options: { value: T; label: ReactNode; disabled?: boolean }[];
  value: T | null;
  onChange: (value: T) => void;
  disabled?: boolean;
  className?: string;
  itemClassName?: string;
}) {
  return (
    <fieldset disabled={disabled} className={cn("grid min-w-0 gap-1", className)} style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
      <legend className="sr-only">{label}</legend>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          disabled={o.disabled}
          onClick={() => onChange(o.value)}
          className={cn(
            "focus-ring h-7 rounded-md text-[11px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40",
            value === o.value ? "bg-container-highest text-foreground" : "bg-container text-muted-foreground hover:text-foreground",
            itemClassName,
          )}
        >
          {o.label}
        </button>
      ))}
    </fieldset>
  );
}
