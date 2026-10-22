import { MinusIcon, PlusIcon, TriangleAlertIcon } from "lucide-react";
import { useId, useState, type ReactElement, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Spinner } from "@/components/ui/spinner";
import { TONE_BG, TONE_TEXT, type OrderSide } from "@/lib/trading";
import { cn } from "@/lib/utils";

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Evenly stepped marks from `min` to `max`, e.g. 50 → 1, 10, 20, 30, 40, 50. */
export function leverageMarks(max: number, min = 1, count = 5) {
  const raw = (max - min) / count;
  const step = [1, 2, 5, 10, 20, 25, 50, 100].find((s) => s >= raw) ?? Math.ceil(raw);
  const marks = [min];
  for (let v = step; v < max; v += step) if (v > min) marks.push(v);
  if (marks[marks.length - 1] !== max) marks.push(max);
  return marks;
}

export interface LeverageSelectorProps {
  value?: number;
  defaultValue?: number;
  onValueChange?: (leverage: number) => void;
  /** Highest selectable leverage. */
  max: number;
  min?: number;
  /** The leverage in effect, shown as "Current". */
  currentLeverage?: number;
  /** Labels under the slider. Defaults to evenly stepped values from `min` to `max`. */
  marks?: number[];
  /** Quick-pick chips above the slider. */
  presets?: number[];
  /** Max position notional at the selected leverage — a number, or a lookup run as the user drags. */
  maxPositionNotional?: number | null | ((leverage: number) => number | null | undefined);
  quote?: string;
  /** Show the risk warning above this leverage. Defaults to half of `max`. */
  warnAbove?: number;
  /** Replaces the default high-leverage warning. */
  warning?: ReactNode;
  /** Blocking message, e.g. "Margin is not enough." — disables confirm. */
  error?: ReactNode;
  /** Header symbol. Omit to hide the header. */
  symbol?: string;
  side?: OrderSide;
  marginMode?: "cross" | "isolated";
  /** Called with the selected leverage. Omit to hide the actions. */
  onConfirm?: (leverage: number) => void;
  onCancel?: () => void;
  confirmLabel?: ReactNode;
  submitting?: boolean;
  disabled?: boolean;
  className?: string;
}

/** Leverage form: stepper input, quick picks, a marked slider and the max notional at that leverage. */
export function LeverageSelector({
  value,
  defaultValue,
  onValueChange,
  max,
  min = 1,
  currentLeverage,
  marks,
  presets,
  maxPositionNotional,
  quote = "USDC",
  warnAbove,
  warning,
  error,
  symbol,
  side,
  marginMode,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
  submitting,
  disabled,
  className,
}: LeverageSelectorProps) {
  const [leverage, setLeverageRaw] = useControllable(value, defaultValue ?? currentLeverage ?? min, onValueChange);
  const setLeverage = (v: number) => setLeverageRaw(clamp(Math.round(v), min, max));
  const [draft, setDraft] = useState<string | null>(null);
  const inputId = useId();
  const hintId = useId();

  const markList = marks ?? leverageMarks(max, min);
  const pos = (v: number) => (max === min ? 0 : ((v - min) / (max - min)) * 100);
  const notional = typeof maxPositionNotional === "function" ? maxPositionNotional(leverage) : maxPositionNotional;
  const threshold = warnAbove ?? Math.max(min + 1, Math.round(max / 2));
  const risky = leverage > threshold;

  return (
    <div data-slot="leverage-selector" className={cn("flex flex-col gap-4", className)}>
      {symbol && (
        <div className="flex items-center gap-2 border-b border-border pb-3">
          <SymbolDisplay symbol={symbol} size="sm" className="text-sm" />
          <span className="ml-auto flex items-center gap-1">
            {side && (
              <SymbolBadge className={cn(TONE_BG[side === "buy" ? "up" : "down"], TONE_TEXT[side === "buy" ? "up" : "down"])}>
                {side === "buy" ? "Long" : "Short"}
              </SymbolBadge>
            )}
            {marginMode && <SymbolBadge>{marginMode === "isolated" ? "Isolated" : "Cross"}</SymbolBadge>}
          </span>
        </div>
      )}

      {currentLeverage != null && (
        <p className="text-center text-xs text-muted-foreground">
          Current: <Numeral value={currentLeverage} dp={0} className="text-foreground" />
          <span className="text-foreground">x</span>
        </p>
      )}

      <div className="flex h-12 items-center gap-1 rounded-xl bg-container px-1.5 focus-within:ring-1 focus-within:ring-primary">
        <button
          type="button"
          aria-label="Decrease leverage"
          disabled={disabled || leverage <= min}
          onClick={() => setLeverage(leverage - 1)}
          className="focus-ring grid size-9 place-items-center rounded-lg text-foreground hover:bg-container-high disabled:opacity-30"
        >
          <MinusIcon className="size-4" />
        </button>
        <label htmlFor={inputId} className="sr-only">
          Leverage
        </label>
        <div className="flex flex-1 items-baseline justify-center gap-0.5">
          <input
            id={inputId}
            inputMode="numeric"
            autoComplete="off"
            disabled={disabled}
            aria-describedby={hintId}
            value={draft ?? String(leverage)}
            onFocus={() => setDraft(String(leverage))}
            onBlur={() => setDraft(null)}
            onChange={(e) => {
              const text = e.target.value.replace(/[^0-9]/g, "").slice(0, 4);
              setDraft(text);
              const n = Number(text);
              if (text && n >= min) setLeverage(n);
            }}
            className="w-16 bg-transparent text-right font-mono text-2xl font-semibold tabular-nums outline-none"
          />
          <span aria-hidden className="text-base text-muted-foreground">
            x
          </span>
        </div>
        <button
          type="button"
          aria-label="Increase leverage"
          disabled={disabled || leverage >= max}
          onClick={() => setLeverage(leverage + 1)}
          className="focus-ring grid size-9 place-items-center rounded-lg text-foreground hover:bg-container-high disabled:opacity-30"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>

      {presets && presets.length > 0 && (
        <div className="grid gap-1.5" style={{ gridTemplateColumns: `repeat(${presets.length}, minmax(0, 1fr))` }}>
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              aria-pressed={leverage === p}
              disabled={disabled || p > max}
              onClick={() => setLeverage(p)}
              className={cn(
                "focus-ring h-8 rounded-lg border font-mono text-xs tabular-nums transition-colors disabled:opacity-30",
                leverage === p ? "border-primary bg-container text-foreground" : "border-border text-muted-foreground hover:text-foreground",
              )}
            >
              {p}x
            </button>
          ))}
        </div>
      )}

      <div className="px-1">
        <Slider
          min={min}
          max={max}
          step={1}
          value={leverage}
          disabled={disabled}
          aria-label="Leverage"
          onValueChange={(v) => setLeverage(Array.isArray(v) ? v[0] : (v as number))}
        />
        <div className="relative h-5">
          {markList.map((m, i) => (
            <button
              key={m}
              type="button"
              disabled={disabled}
              onClick={() => setLeverage(m)}
              style={{ left: `${pos(m)}%` }}
              className={cn(
                "focus-ring absolute top-0.5 rounded px-0.5 font-mono text-[11px] tabular-nums transition-colors",
                i === 0 ? "" : i === markList.length - 1 ? "-translate-x-full" : "-translate-x-1/2",
                leverage >= m ? "text-primary" : "text-muted-foreground hover:text-foreground",
              )}
            >
              {m}x
            </button>
          ))}
        </div>
      </div>

      <div id={hintId} className="flex flex-col gap-1 border-t border-border pt-3 text-[11px] leading-relaxed text-muted-foreground">
        {notional !== undefined && (
          <p>
            Max position at {leverage}x:{" "}
            <Numeral value={notional} dp={0} unit={quote} className="text-foreground" />
          </p>
        )}
        <p>Actual position leverage adjusts with notional changes and may fall below the selected leverage.</p>
        {risky && !error && (
          <p className="flex items-start gap-1.5 text-amber-600 dark:text-amber-400">
            <TriangleAlertIcon aria-hidden className="mt-0.5 size-3 shrink-0" />
            <span>{warning ?? "Higher leverage increases your liquidation risk."}</span>
          </p>
        )}
        {error && (
          <p role="alert" className="flex items-start gap-1.5 text-destructive">
            <TriangleAlertIcon aria-hidden className="mt-0.5 size-3 shrink-0" />
            <span>{error}</span>
          </p>
        )}
      </div>

      {(onConfirm || onCancel) && (
        <div className="grid grid-cols-2 gap-2">
          <Button variant="tonal" onClick={onCancel} disabled={submitting}>
            Cancel
          </Button>
          <Button disabled={disabled || submitting || !!error || leverage === currentLeverage} onClick={() => onConfirm?.(leverage)}>
            {submitting && <Spinner />}
            {confirmLabel}
          </Button>
        </div>
      )}
    </div>
  );
}

export interface LeverageDialogProps
  extends Omit<LeverageSelectorProps, "value" | "defaultValue" | "onValueChange" | "onConfirm" | "onCancel" | "currentLeverage" | "className"> {
  /** The leverage in effect. The dialog edits a draft and reports it on confirm. */
  value: number;
  /** Called with the confirmed leverage. Uncontrolled dialogs then close; with `open` controlled, close it yourself once saved. */
  onConfirm?: (leverage: number) => void;
  /** Called on every drag or keystroke — use it to recompute `maxPositionNotional` or `error`. */
  onDraftChange?: (leverage: number) => void;
  title?: ReactNode;
  /** Custom trigger element. Defaults to a small "10x" button. */
  trigger?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/** `LeverageSelector` in a dialog, opened from a trigger. */
export function LeverageDialog({ value, onConfirm, onDraftChange, title = "Adjust leverage", trigger, open, defaultOpen = false, onOpenChange, ...props }: LeverageDialogProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  return (
    <Dialog open={isOpen} onOpenChange={(o) => setOpen(o)}>
      <DialogTrigger
        disabled={props.disabled}
        render={
          trigger ?? (
            <Button variant="tonal" size="xs" className="font-mono tabular-nums">
              {value}x
            </Button>
          )
        }
      />
      <DialogContent className="gap-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          <DialogDescription className="sr-only">Choose the leverage for new and open positions on this symbol.</DialogDescription>
        </DialogHeader>
        <LeverageSelector
          {...props}
          defaultValue={value}
          currentLeverage={value}
          onValueChange={onDraftChange}
          onCancel={() => setOpen(false)}
          onConfirm={(lev) => {
            onConfirm?.(lev);
            // Controlled dialogs stay open so the host can show `submitting` and close when done.
            if (open === undefined) setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
