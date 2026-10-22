import { useCallback, useId, useState, type ReactElement, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatNumber, parseSymbol, TONE_BG, TONE_TEXT } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type ClosePositionSide = "long" | "short";
export type CloseOrderType = "market" | "limit";

export type CloseOrder = {
  orderType: CloseOrderType;
  /** `null` for market closes. */
  price: number | null;
  quantity: number;
};

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

/** Keep digits and one decimal point. */
const sanitize = (text: string) => {
  const clean = text.replace(/[^0-9.]/g, "");
  const dot = clean.indexOf(".");
  return dot === -1 ? clean : clean.slice(0, dot + 1) + clean.slice(dot + 1).replace(/\./g, "");
};
const toNumber = (text: string) => (text.trim() === "" ? NaN : Number(text));
const trimFixed = (value: number, dp: number) => String(Number(value.toFixed(dp)));

const PERCENTS = [25, 50, 75, 100];

/* ------------------------------------------------------------ form */

export interface ClosePositionFormProps {
  /** `PERP_BTC_USDC`, `BTC-PERP`… */
  symbol: string;
  iconSrc?: string;
  /** The side of the position being closed. Closing a long sells; closing a short buys. */
  side: ClosePositionSide;
  /** Current absolute position size in base. */
  positionQuantity: number;
  markPrice?: number | null;
  leverage?: number;
  tick?: number;
  /** Decimal places for quantities. */
  baseDp?: number;
  /** Quote currency label. */
  quote?: string;
  orderType?: CloseOrderType;
  defaultOrderType?: CloseOrderType;
  onOrderTypeChange?: (type: CloseOrderType) => void;
  /** Limit price as typed. */
  price?: string;
  defaultPrice?: string;
  onPriceChange?: (price: string) => void;
  /** Close quantity as typed. Defaults to the whole position. */
  quantity?: string;
  defaultQuantity?: string;
  onQuantityChange?: (quantity: string) => void;
  /** Estimated realised PnL — a number, or a function of the current inputs. */
  estimatedPnl?: number | null | ((order: CloseOrder) => number | null | undefined);
  priceError?: ReactNode;
  quantityError?: ReactNode;
  submitting?: boolean;
  confirmLabel?: ReactNode;
  onConfirm?: (order: CloseOrder) => void;
  onCancel?: () => void;
  className?: string;
}

/** The close-position form without a dialog — drop it into a popover or sheet. */
export function ClosePositionForm({
  symbol,
  iconSrc,
  side,
  positionQuantity,
  markPrice,
  leverage,
  tick,
  baseDp = 4,
  quote = "USDC",
  orderType: orderTypeProp,
  defaultOrderType = "market",
  onOrderTypeChange,
  price: priceProp,
  defaultPrice,
  onPriceChange,
  quantity: quantityProp,
  defaultQuantity,
  onQuantityChange,
  estimatedPnl,
  priceError,
  quantityError,
  submitting,
  confirmLabel = "Confirm",
  onConfirm,
  onCancel,
  className,
}: ClosePositionFormProps) {
  const id = useId();
  const [orderType, setOrderType] = useControllable(orderTypeProp, defaultOrderType, onOrderTypeChange);
  const [price, setPrice] = useControllable(priceProp, defaultPrice ?? (markPrice != null ? formatNumber(markPrice, "price", { tick }).replace(/,/g, "") : ""), onPriceChange);
  const [quantity, setQuantity] = useControllable(quantityProp, defaultQuantity ?? trimFixed(positionQuantity, baseDp), onQuantityChange);

  const isLimit = orderType === "limit";
  const qty = toNumber(quantity);
  const px = toNumber(price);
  const percent = positionQuantity > 0 && Number.isFinite(qty) ? Math.min(100, Math.max(0, (qty / positionQuantity) * 100)) : 0;
  const order: CloseOrder = { orderType, price: isLimit && Number.isFinite(px) ? px : null, quantity: Number.isFinite(qty) ? qty : 0 };
  const pnl = typeof estimatedPnl === "function" ? estimatedPnl(order) : estimatedPnl;
  const closeSide = side === "long" ? "Sell" : "Buy";
  const closeTone = side === "long" ? "down" : "up";
  const invalid = !(qty > 0) || qty > positionQuantity || (isLimit && !(px > 0)) || Boolean(priceError) || Boolean(quantityError);

  const setPercent = (p: number) => setQuantity(p >= 100 ? trimFixed(positionQuantity, baseDp) : trimFixed((positionQuantity * p) / 100, baseDp));

  return (
    <div data-slot="close-position-form" className={cn("flex flex-col gap-4 text-sm", className)}>
      <div className="flex items-center justify-between gap-2">
        <SymbolDisplay symbol={symbol} iconSrc={iconSrc} size="sm" badge={leverage != null ? `${leverage}x` : undefined} />
        <span className="flex items-center gap-1">
          <SymbolBadge>{isLimit ? "Limit" : "Market"}</SymbolBadge>
          <SymbolBadge className={cn(TONE_BG[closeTone], TONE_TEXT[closeTone])}>{closeSide}</SymbolBadge>
        </span>
      </div>

      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">Mark price</span>
        <Numeral value={markPrice} tick={tick} unit={quote} />
      </div>

      <ToggleGroup
        size="sm"
        value={[orderType]}
        onValueChange={(v) => v[0] && setOrderType(v[0] as CloseOrderType)}
        className="w-full"
        aria-label="Close order type"
      >
        <ToggleGroupItem value="market" className="flex-1 text-xs">
          Market
        </ToggleGroupItem>
        <ToggleGroupItem value="limit" className="flex-1 text-xs">
          Limit
        </ToggleGroupItem>
      </ToggleGroup>

      <div className="flex flex-col gap-1">
        <InputGroup className={cn("h-10", !isLimit && "opacity-60")}>
          <InputGroupAddon>
            <label htmlFor={`${id}-price`} className="text-xs font-normal text-muted-foreground">
              Price
            </label>
          </InputGroupAddon>
          <InputGroupInput
            id={`${id}-price`}
            inputMode="decimal"
            autoComplete="off"
            className="text-right font-mono tabular-nums"
            disabled={!isLimit}
            placeholder={isLimit ? "0.00" : "Market"}
            value={isLimit ? price : ""}
            aria-invalid={Boolean(priceError) || undefined}
            onChange={(e) => setPrice(sanitize(e.target.value))}
          />
          <InputGroupAddon align="inline-end" className="pr-3.5 text-xs font-normal">
            {quote}
          </InputGroupAddon>
        </InputGroup>
        {isLimit && priceError && <p className="text-[11px] text-destructive">{priceError}</p>}
      </div>

      <div className="flex flex-col gap-1">
        <div className="flex gap-2">
          <InputGroup className="h-10">
            <InputGroupAddon>
              <label htmlFor={`${id}-qty`} className="text-xs font-normal text-muted-foreground">
                Quantity
              </label>
            </InputGroupAddon>
            <InputGroupInput
              id={`${id}-qty`}
              inputMode="decimal"
              autoComplete="off"
              className="text-right font-mono tabular-nums"
              placeholder="0"
              value={quantity}
              aria-invalid={Boolean(quantityError) || qty > positionQuantity || undefined}
              onChange={(e) => setQuantity(sanitize(e.target.value))}
            />
            <InputGroupAddon align="inline-end" className="pr-3.5 text-xs font-normal">
              {parseSymbol(symbol).base}
            </InputGroupAddon>
          </InputGroup>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className={cn("h-10 rounded-md px-3 text-xs", percent === 100 && "border-primary text-primary")}
            onClick={() => setPercent(100)}
          >
            Position
          </Button>
        </div>
        {quantityError && <p className="text-[11px] text-destructive">{quantityError}</p>}
      </div>

      <PercentPicker value={percent} onChange={setPercent} label="Close quantity percentage" />

      <div className="flex items-center justify-between text-xs">
        <span className="text-primary">{Math.round(percent)}%</span>
        <button type="button" onClick={() => setPercent(100)} className="focus-ring flex items-baseline gap-1 rounded-sm">
          <span className="text-primary">Max</span>
          <Numeral value={positionQuantity} dp={baseDp} pad={false} className="text-muted-foreground" />
        </button>
      </div>

      {estimatedPnl !== undefined && (
        <div className="flex items-center justify-between rounded-lg bg-container px-3 py-2 text-xs">
          <span className="text-muted-foreground">Est. PnL</span>
          <Numeral value={pnl} dp={2} coloring showSign unit={quote} className="font-medium" />
        </div>
      )}

      <div className="flex gap-2">
        {onCancel && (
          <Button type="button" variant="tonal" className="flex-1" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="button" className="flex-1" disabled={invalid || submitting} onClick={() => onConfirm?.(order)}>
          {submitting ? "Closing…" : confirmLabel}
        </Button>
      </div>
    </div>
  );
}

function PercentPicker({ value, onChange, label }: { value: number; onChange: (percent: number) => void; label: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-4 gap-1.5">
        {PERCENTS.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-pressed={Math.round(value) === p}
            className={cn(
              "focus-ring h-7 rounded-md border border-border text-[11px] font-medium text-muted-foreground transition-colors hover:text-foreground",
              Math.round(value) === p && "border-primary text-primary",
            )}
          >
            {p}%
          </button>
        ))}
      </div>
      <Slider value={value} min={0} max={100} step={1} onValueChange={(v) => onChange(Array.isArray(v) ? v[0] : (v as number))} aria-label={label} />
    </div>
  );
}

/* ------------------------------------------------------------ dialog */

export interface ClosePositionDialogProps extends Omit<ClosePositionFormProps, "onCancel" | "className"> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Element that opens the dialog, e.g. `<Button>Close</Button>`. */
  trigger?: ReactElement;
  title?: ReactNode;
  /** Close the dialog after `onConfirm`. */
  closeOnConfirm?: boolean;
  className?: string;
}

/** Close a position at market or limit, in part or in full. */
export function ClosePositionDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  title,
  closeOnConfirm = true,
  onConfirm,
  className,
  ...form
}: ClosePositionDialogProps) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className={cn("gap-4 sm:max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title ?? (form.orderType === "limit" ? "Limit close" : "Close position")}</DialogTitle>
          <DialogDescription className="sr-only">Close all or part of your {form.symbol} position.</DialogDescription>
        </DialogHeader>
        <ClosePositionForm
          {...form}
          onCancel={() => setOpen(false)}
          onConfirm={(order) => {
            onConfirm?.(order);
            if (closeOnConfirm) setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------ close all */

export type CloseAllScope = "all" | "profitable" | "losing";

export interface CloseAllPositionsDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactElement;
  scope?: CloseAllScope;
  defaultScope?: CloseAllScope;
  onScopeChange?: (scope: CloseAllScope) => void;
  /** Optional counts shown beside each option. Options with a count of 0 are disabled. */
  counts?: Partial<Record<CloseAllScope, number>>;
  description?: ReactNode;
  submitting?: boolean;
  closeOnConfirm?: boolean;
  onConfirm?: (scope: CloseAllScope) => void;
  className?: string;
}

const SCOPES: { value: CloseAllScope; label: string }[] = [
  { value: "all", label: "Close all positions" },
  { value: "profitable", label: "Close profitable positions" },
  { value: "losing", label: "Close loss-making positions" },
];

/** Pick which positions to flatten at market — all, profitable or losing. */
export function CloseAllPositionsDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  scope: scopeProp,
  defaultScope = "all",
  onScopeChange,
  counts,
  description = "Select which positions to close. They will be closed at the market price of each market.",
  submitting,
  closeOnConfirm = true,
  onConfirm,
  className,
}: CloseAllPositionsDialogProps) {
  const id = useId();
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const [scope, setScope] = useControllable(scopeProp, defaultScope, onScopeChange);
  const disabled = counts?.[scope] === 0;
  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className={cn("gap-4 sm:max-w-sm", className)}>
        <DialogHeader>
          <DialogTitle>Close all</DialogTitle>
          <DialogDescription className="text-xs">{description}</DialogDescription>
        </DialogHeader>
        <RadioGroup value={scope} onValueChange={(v) => setScope(v as CloseAllScope)} className="gap-1.5" aria-label="Positions to close">
          {SCOPES.map((s) => (
            <Label
              key={s.value}
              htmlFor={`${id}-${s.value}`}
              className="cursor-pointer justify-between rounded-lg border border-border px-3 py-2.5 text-xs has-data-checked:border-foreground has-data-checked:bg-container"
            >
              <span className="flex items-center gap-2.5">
                <RadioGroupItem id={`${id}-${s.value}`} value={s.value} disabled={counts?.[s.value] === 0} />
                {s.label}
              </span>
              {counts?.[s.value] != null && <span className="font-mono text-muted-foreground tabular-nums">{counts[s.value]}</span>}
            </Label>
          ))}
        </RadioGroup>
        <DialogFooter className="flex-row">
          <Button type="button" variant="tonal" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className="flex-1"
            disabled={disabled || submitting}
            onClick={() => {
              onConfirm?.(scope);
              if (closeOnConfirm) setOpen(false);
            }}
          >
            {submitting ? "Closing…" : "Confirm"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
