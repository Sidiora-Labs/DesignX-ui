import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, TriangleAlertIcon } from "lucide-react";
import { useCallback, useState, type ReactElement, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { SIDE_FILL, TONE_BG, TONE_TEXT, type OrderSide } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type ReversePositionSide = "long" | "short";

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

/* ------------------------------------------------------------ order card */

export interface ReverseOrderCardProps {
  title: ReactNode;
  side: OrderSide;
  leverage?: number;
  quantity: number;
  baseDp?: number;
  /** Shown as "Market" when omitted. */
  price?: ReactNode;
  /** Adds an "Est. PnL" row. */
  estimatedPnl?: number | null;
  /** Adds an "Est. liq. price" row. */
  estimatedLiquidationPrice?: ReactNode;
  className?: string;
}

/** One leg of the reverse: title, side and leverage badges, then quantity, price and estimates. */
export function ReverseOrderCard({ title, side, leverage, quantity, baseDp = 4, price, estimatedPnl, estimatedLiquidationPrice, className }: ReverseOrderCardProps) {
  const tone = side === "buy" ? "up" : "down";
  return (
    <div data-slot="reverse-order-card" className={cn("flex min-w-0 flex-col gap-3 rounded-xl bg-container p-3", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="truncate text-sm font-medium">{title}</span>
        <span className="flex shrink-0 items-center gap-1">
          <SymbolBadge className={cn(TONE_BG[tone], TONE_TEXT[tone])}>{side === "buy" ? "Buy" : "Sell"}</SymbolBadge>
          {leverage != null && <SymbolBadge>{leverage}x</SymbolBadge>}
        </span>
      </div>
      <dl className="flex flex-col gap-1.5 text-xs">
        <div className="flex items-center justify-between gap-2">
          <dt className="text-muted-foreground">Qty</dt>
          <dd>
            <Numeral value={quantity} dp={baseDp} pad={false} className={TONE_TEXT[tone]} />
          </dd>
        </div>
        <div className="flex items-center justify-between gap-2">
          <dt className="text-muted-foreground">Price</dt>
          <dd className="font-medium">{price ?? "Market"}</dd>
        </div>
        {estimatedPnl !== undefined && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">Est. PnL</dt>
            <dd>
              <Numeral value={estimatedPnl} dp={2} coloring showSign className="font-medium" />
            </dd>
          </div>
        )}
        {estimatedLiquidationPrice !== undefined && (
          <div className="flex items-center justify-between gap-2">
            <dt className="text-muted-foreground">Est. liq. price</dt>
            <dd className="font-mono font-medium tabular-nums">{estimatedLiquidationPrice}</dd>
          </div>
        )}
      </dl>
    </div>
  );
}

/* ------------------------------------------------------------ dialog */

export interface ReversePositionDialogProps {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  trigger?: ReactElement;
  symbol: string;
  iconSrc?: string;
  /** Side of the current position. */
  side: ReversePositionSide;
  /** Current absolute position size. */
  quantity: number;
  /** Size of the opposite position. Defaults to `quantity`. */
  reverseQuantity?: number;
  leverage?: number;
  markPrice?: number | null;
  tick?: number;
  baseDp?: number;
  quote?: string;
  /** Unrealised PnL realised by the close leg. */
  estimatedPnl?: number | null;
  /** Estimated liquidation price of the new position. */
  estimatedLiquidationPrice?: number | null;
  /** Replaces the warning text, e.g. a "below minimum size" error. */
  error?: ReactNode;
  description?: ReactNode;
  submitting?: boolean;
  closeOnConfirm?: boolean;
  onConfirm?: () => void;
  className?: string;
}

/** Flip a long into a short — or back — with the close and open legs side by side. */
export function ReversePositionDialog({
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  trigger,
  symbol,
  iconSrc,
  side,
  quantity,
  reverseQuantity,
  leverage,
  markPrice,
  tick,
  baseDp = 4,
  quote = "USDC",
  estimatedPnl,
  estimatedLiquidationPrice,
  error,
  description = "Closes your current position and opens the opposite one at market price. If your balance is insufficient the reverse order will fail. Orders above the maximum size are split into smaller orders.",
  submitting,
  closeOnConfirm = true,
  onConfirm,
  className,
}: ReversePositionDialogProps) {
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  const isLong = side === "long";
  const toSide: OrderSide = isLong ? "sell" : "buy";
  const toTone = isLong ? "down" : "up";
  const reverseTo = isLong ? "Reverse to short" : "Reverse to long";
  const DirIcon = isLong ? ArrowDownIcon : ArrowUpIcon;

  return (
    <Dialog open={open} onOpenChange={(next) => setOpen(next)}>
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className={cn("gap-4 sm:max-w-xl", className)}>
        <DialogHeader>
          <DialogTitle>Reverse position</DialogTitle>
          <DialogDescription className="sr-only">
            {reverseTo} for {symbol}.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <SymbolDisplay symbol={symbol} iconSrc={iconSrc} size="sm" className="text-sm" />
            <SymbolBadge className={cn("h-5 px-1.5 text-[11px]", TONE_BG[toTone], TONE_TEXT[toTone])}>{reverseTo}</SymbolBadge>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Mark price</span>
            <Numeral value={markPrice} tick={tick} unit={quote} />
          </div>
        </div>

        <div className="grid items-stretch gap-2 sm:grid-cols-[1fr_auto_1fr]">
          <ReverseOrderCard
            title={isLong ? "Market close long" : "Market close short"}
            side={isLong ? "sell" : "buy"}
            leverage={leverage}
            quantity={quantity}
            baseDp={baseDp}
            estimatedPnl={estimatedPnl}
          />
          <div className="flex items-center justify-center gap-2 sm:flex-col">
            <span className="h-px flex-1 bg-border sm:hidden" />
            <span className={cn("flex items-center gap-1 rounded-full border border-border px-2.5 py-0.5 text-[11px] font-medium", TONE_TEXT[toTone])}>
              <DirIcon aria-hidden className="size-3 sm:hidden" />
              <ArrowRightIcon aria-hidden className="hidden size-3.5 sm:block" />
              <span className="sm:sr-only">{reverseTo}</span>
            </span>
            <span className="h-px flex-1 bg-border sm:hidden" />
          </div>
          <ReverseOrderCard
            title={isLong ? "Market open short" : "Market open long"}
            side={toSide}
            leverage={leverage}
            quantity={reverseQuantity ?? quantity}
            baseDp={baseDp}
            estimatedLiquidationPrice={estimatedLiquidationPrice !== undefined ? <Numeral value={estimatedLiquidationPrice} tick={tick} /> : undefined}
          />
        </div>

        {error ? (
          <p role="alert" className="flex gap-2 rounded-lg bg-destructive-container px-3 py-2 text-xs text-destructive">
            <TriangleAlertIcon aria-hidden className="mt-px size-3.5 shrink-0" />
            <span>{error}</span>
          </p>
        ) : (
          <p className="flex gap-2 rounded-lg bg-warning-container px-3 py-2 text-xs text-warning">
            <TriangleAlertIcon aria-hidden className="mt-px size-3.5 shrink-0" />
            <span>{description}</span>
          </p>
        )}

        <DialogFooter className="flex-row">
          <Button type="button" variant="tonal" className="flex-1" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            className={cn("flex-1", SIDE_FILL[toSide])}
            disabled={Boolean(error) || submitting}
            onClick={() => {
              onConfirm?.();
              if (closeOnConfirm) setOpen(false);
            }}
          >
            {submitting ? "Reversing…" : reverseTo}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
