import { ArrowRightIcon } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useId, useState, type ReactElement, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { SPRING_SWAP } from "@/lib/ease";
import { TONE_BG, TONE_TEXT } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type AdjustMarginMode = "add" | "remove";

/* ------------------------------------------------------------ local helpers */

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [controlled ? value : inner, set] as const;
}

const sanitize = (text: string) => {
  const clean = text.replace(/[^0-9.]/g, "");
  const dot = clean.indexOf(".");
  return dot === -1 ? clean : clean.slice(0, dot + 1) + clean.slice(dot + 1).replace(/\./g, "");
};
const toNumber = (text: string) => (text.trim() === "" ? NaN : Number(text));
const trimFixed = (value: number, dp: number) => String(Number(value.toFixed(dp)));

/* ------------------------------------------------------------ form */

export interface AdjustMarginFormProps {
  symbol: string;
  iconSrc?: string;
  side?: "long" | "short";
  /** Current leverage, shown as a badge and as the "before" effective leverage. */
  leverage?: number;
  /** Current isolated margin in quote. */
  currentMargin: number;
  /** Most margin that can be added — usually free collateral. */
  maxAdd: number;
  /** Most margin that can be removed without breaching maintenance. */
  maxRemove: number;
  /** Current liquidation price. */
  liquidationPrice?: number | null;
  /** Liquidation price after the adjustment — compute it from `onAmountChange`. */
  liquidationPriceAfter?: number | null;
  /** Margin after the adjustment. Defaults to current ± amount. */
  marginAfter?: number | null;
  /** Effective leverage after the adjustment. The row is hidden when omitted. */
  leverageAfter?: number | null;
  tick?: number;
  quote?: string;
  /** Decimal places of the amount input. */
  amountDp?: number;
  mode?: AdjustMarginMode;
  defaultMode?: AdjustMarginMode;
  onModeChange?: (mode: AdjustMarginMode) => void;
  /** Amount as typed. */
  amount?: string;
  defaultAmount?: string;
  /** Fires on every input or slider change — derive the "after" values here. */
  onAmountChange?: (amount: string, details: { value: number; mode: AdjustMarginMode }) => void;
  error?: ReactNode;
  submitting?: boolean;
  confirmLabel?: ReactNode;
  onConfirm?: (adjustment: { mode: AdjustMarginMode; amount: number }) => void;
  onCancel?: () => void;
  className?: string;
}

function InfoRow({ label, before, after, show }: { label: ReactNode; before: ReactNode; after?: ReactNode; show: boolean }) {
  const reduce = useReducedMotion();
  return (
    <div className="flex items-center justify-between gap-3 text-xs">
      <span className="text-muted-foreground">{label}</span>
      <span className="flex items-center gap-1.5 font-mono tabular-nums">
        <span className={cn(show && "text-muted-foreground")}>{before}</span>
        <AnimatePresence initial={false}>
          {show && (
            <motion.span
              key="after"
              className="flex items-center gap-1.5"
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: -4 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={SPRING_SWAP}
            >
              <ArrowRightIcon aria-hidden className="size-3 text-muted-foreground" />
              <span className="text-foreground">{after}</span>
            </motion.span>
          )}
        </AnimatePresence>
      </span>
    </div>
  );
}

/** Add or remove isolated margin — the form without a dialog. */
export function AdjustMarginForm({
  symbol,
  iconSrc,
  side,
  leverage,
  currentMargin,
  maxAdd,
  maxRemove,
  liquidationPrice,
  liquidationPriceAfter,
  marginAfter,
  leverageAfter,
  tick,
  quote = "USDC",
  amountDp = 2,
  mode: modeProp,
  defaultMode = "add",
  onModeChange,
  amount: amountProp,
  defaultAmount = "",
  onAmountChange,
  error,
  submitting,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  className,
}: AdjustMarginFormProps) {
  const id = useId();
  const [mode, setModeState] = useControllable(modeProp, defaultMode, onModeChange);
  const [amount, setAmountState] = useControllable(amountProp, defaultAmount);
  const isAdd = mode === "add";
  const max = Math.max(0, isAdd ? maxAdd : maxRemove);
  const value = toNumber(amount);
  const valid = Number.isFinite(value) ? value : 0;
  const percent = max > 0 ? Math.min(100, (valid / max) * 100) : 0;
  const changed = valid > 0;
  const after = marginAfter !== undefined ? marginAfter : currentMargin + (isAdd ? valid : -valid);
  const over = valid > max;

  const setAmount = (next: string, nextMode = mode) => {
    setAmountState(next);
    const n = toNumber(next);
    onAmountChange?.(next, { value: Number.isFinite(n) ? n : 0, mode: nextMode });
  };
  const setMode = (next: AdjustMarginMode) => {
    setModeState(next);
    setAmount("", next);
  };
  const setPercent = (p: number) => setAmount(p <= 0 ? "" : trimFixed(p >= 100 ? max : (max * p) / 100, amountDp));

  return (
    <div data-slot="adjust-margin-form" className={cn("flex flex-col gap-4 text-sm", className)}>
      <div className="flex items-center gap-1.5">
        <SymbolDisplay symbol={symbol} iconSrc={iconSrc} size="sm" />
        {side && (
          <SymbolBadge className={cn(TONE_BG[side === "long" ? "up" : "down"], TONE_TEXT[side === "long" ? "up" : "down"])}>
            {side === "long" ? "Long" : "Short"}
          </SymbolBadge>
        )}
        <SymbolBadge>Isolated</SymbolBadge>
        {leverage != null && <SymbolBadge>{leverage}x</SymbolBadge>}
      </div>

      <ToggleGroup size="sm" value={[mode]} onValueChange={(v) => v[0] && setMode(v[0] as AdjustMarginMode)} className="w-full" aria-label="Adjustment">
        <ToggleGroupItem value="add" className="flex-1 text-xs">
          Add margin
        </ToggleGroupItem>
        <ToggleGroupItem value="remove" className="flex-1 text-xs">
          Remove margin
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex flex-col gap-1">
        <InputGroup className="h-11 bg-container">
          <InputGroupAddon>
            <label htmlFor={`${id}-amount`} className="text-xs font-normal text-muted-foreground">
              Amount
            </label>
          </InputGroupAddon>
          <InputGroupInput
            id={`${id}-amount`}
            inputMode="decimal"
            autoComplete="off"
            placeholder="0.00"
            disabled={max <= 0}
            className="text-right font-mono font-medium tabular-nums"
            value={amount}
            aria-invalid={over || Boolean(error) || undefined}
            onChange={(e) => setAmount(sanitize(e.target.value))}
          />
          <InputGroupAddon align="inline-end" className="pr-3.5 text-xs font-normal">
            {quote}
          </InputGroupAddon>
        </InputGroup>
        {(error || over) && <p className="text-[11px] text-destructive">{error ?? `Amount can't exceed ${max.toFixed(amountDp)} ${quote}.`}</p>}
      </div>

      <div className="flex flex-col gap-1.5">
        <Slider value={percent} min={0} max={100} step={1} disabled={max <= 0} onValueChange={(v) => setPercent(Array.isArray(v) ? v[0] : (v as number))} aria-label="Amount percentage" />
        <div className="flex items-center justify-between text-xs">
          <span className="text-primary">{Math.round(percent)}%</span>
          <button type="button" disabled={max <= 0} onClick={() => setPercent(100)} className="focus-ring flex items-baseline gap-1 rounded-sm disabled:opacity-50">
            <span className="text-primary">Max</span>
            <Numeral value={max} dp={amountDp} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2 rounded-xl bg-container p-3">
        <InfoRow label="Margin" before={<Numeral value={currentMargin} dp={2} unit={quote} />} after={<Numeral value={after} dp={2} unit={quote} />} show={changed} />
        <InfoRow
          label="Liq. price"
          before={<Numeral value={liquidationPrice} tick={tick} />}
          after={<Numeral value={liquidationPriceAfter} tick={tick} className="text-amber-600 dark:text-amber-400" />}
          show={changed && liquidationPriceAfter !== undefined}
        />
        {leverageAfter !== undefined && (
          <InfoRow label="Effective leverage" before={<Numeral value={leverage} dp={2} unit="x" />} after={<Numeral value={leverageAfter} dp={2} unit="x" />} show={changed} />
        )}
      </div>

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="tonal" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="button" className="flex-1" disabled={!changed || over || Boolean(error) || submitting} onClick={() => onConfirm?.({ mode, amount: valid })}>
          {submitting ? "Updating…" : confirmLabel}
        </Button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------ dialog */

export interface AdjustMarginDialogProps extends Omit<AdjustMarginFormProps, "onCancel" | "className"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactElement;
  title?: ReactNode;
  closeOnConfirm?: boolean;
  className?: string;
}

/** Add or remove isolated margin with a before → after liquidation-price preview. */
export function AdjustMarginDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title = "Adjust margin",
  closeOnConfirm = true,
  onConfirm,
  className,
  ...form
}: AdjustMarginDialogProps) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className={cn("gap-4 sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">Add or remove isolated margin for {form.symbol}.</DialogDescription>
        </DialogHeader>
        <AdjustMarginForm
          {...form}
          onCancel={() => setOpen(false)}
          onConfirm={(adjustment) => {
            onConfirm?.(adjustment);
            if (closeOnConfirm) setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
