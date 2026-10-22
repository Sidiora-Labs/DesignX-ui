import { TriangleAlertIcon } from "lucide-react";
import { useId, useState, type ReactElement, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { parseSymbol, SIDE_FILL, sideTone, TONE_BG, TONE_TEXT, type OrderSide } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type ConfirmOrderType = "limit" | "market" | "stop-limit" | "stop-market" | "scaled" | "trailing-stop";

export const CONFIRM_ORDER_TYPE_LABEL: Record<ConfirmOrderType, string> = {
  limit: "Limit",
  market: "Market",
  "stop-limit": "Stop limit",
  "stop-market": "Stop market",
  scaled: "Scaled",
  "trailing-stop": "Trailing stop",
};

export type OrderConfirmTpsl = {
  scope?: "entire" | "partial";
  /** Partial quantity, when `scope` is `partial`. */
  quantity?: number | null;
  tpTriggerPrice?: number | null;
  /** Limit price — omit or `null` for a market order. */
  tpOrderPrice?: number | null;
  slTriggerPrice?: number | null;
  slOrderPrice?: number | null;
};

export type OrderConfirmSummary = {
  symbol: string;
  side: OrderSide;
  type: ConfirmOrderType;
  quantity: number;
  /** Limit price. Ignored for market and stop-market orders. */
  price?: number | null;
  triggerPrice?: number | null;
  /** Order value in quote. Defaults to quantity × price when both are known. */
  notional?: number | null;
  /** Trailing-stop parameters. `callbackRate` is a fraction. */
  activationPrice?: number | null;
  callbackValue?: number | null;
  callbackRate?: number | null;
  tpsl?: OrderConfirmTpsl | null;
  /** Estimated fee in quote. */
  fee?: number | null;
  estLiqPrice?: number | null;
  leverage?: number;
  marginMode?: "cross" | "isolated";
  reduceOnly?: boolean;
  /** Time-in-force flag. */
  execution?: "post-only" | "ioc" | "fok" | null;
};

const EXECUTION_LABEL = { "post-only": "Post only", ioc: "IOC", fok: "FOK" } as const;

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

function Row({ label, children }: { label: ReactNode; children: ReactNode }) {
  return (
    <div className="flex items-baseline justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="text-right text-foreground">{children}</dd>
    </div>
  );
}

const Market = () => <span className="text-muted-foreground">Market</span>;

export interface OrderConfirmDetailsProps {
  order: OrderConfirmSummary;
  /** Price increment. */
  tick?: number;
  /** Quantity decimals. */
  baseDp?: number;
  className?: string;
}

/** The order summary on its own — header tags, size, prices, TP/SL and costs. */
export function OrderConfirmDetails({ order, tick, baseDp = 4, className }: OrderConfirmDetailsProps) {
  const { base, quote } = parseSymbol(order.symbol);
  const q = quote || "USDC";
  const tone = sideTone(order.side);
  const isMarket = order.type === "market" || order.type === "stop-market";
  const hasTrigger = order.type === "stop-limit" || order.type === "stop-market";
  const notional = order.notional ?? (!isMarket && order.price != null ? order.price * order.quantity : null);
  const tpsl = order.tpsl;
  const hasTpsl = !!tpsl && (tpsl.tpTriggerPrice != null || tpsl.slTriggerPrice != null);

  const legPrice = (trigger: number | null | undefined, price: number | null | undefined, kind: "up" | "down", isOrderPrice: boolean) => {
    if (trigger == null) return <span className="text-muted-foreground">—</span>;
    if (isOrderPrice && price == null) return <Market />;
    return <Numeral value={isOrderPrice ? price : trigger} tick={tick} unit={q} className={TONE_TEXT[kind]} />;
  };

  return (
    <div data-slot="order-confirm-details" className={cn("flex flex-col gap-4 text-xs", className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <SymbolDisplay symbol={order.symbol} size="sm" className="text-sm" />
          <span className="flex flex-wrap gap-1">
            {order.marginMode && <SymbolBadge>{order.marginMode === "isolated" ? "Isolated" : "Cross"}</SymbolBadge>}
            {order.leverage != null && <SymbolBadge>{order.leverage}x</SymbolBadge>}
            {order.reduceOnly && <SymbolBadge>Reduce only</SymbolBadge>}
            {order.execution && <SymbolBadge>{EXECUTION_LABEL[order.execution]}</SymbolBadge>}
          </span>
        </div>
        <span className="flex shrink-0 gap-1">
          <SymbolBadge className="h-5 px-1.5 text-[11px]">{CONFIRM_ORDER_TYPE_LABEL[order.type]}</SymbolBadge>
          <SymbolBadge className={cn("h-5 px-1.5 text-[11px]", TONE_BG[tone], TONE_TEXT[tone])}>{order.side === "buy" ? "Buy" : "Sell"}</SymbolBadge>
        </span>
      </div>

      <dl className="flex flex-col gap-1.5 border-t border-border pt-4">
        <Row label="Quantity">
          <Numeral value={order.quantity} dp={baseDp} pad={false} unit={base} />
        </Row>
        {hasTrigger && (
          <Row label="Trigger price">
            <Numeral value={order.triggerPrice} tick={tick} unit={q} />
          </Row>
        )}
        {order.type === "trailing-stop" ? (
          <>
            {order.activationPrice != null && (
              <Row label="Activation price">
                <Numeral value={order.activationPrice} tick={tick} unit={q} />
              </Row>
            )}
            {order.callbackRate != null ? (
              <Row label="Trailing rate">
                <Numeral value={order.callbackRate} rule="percent" pad={false} />
              </Row>
            ) : (
              <Row label="Trailing value">
                <Numeral value={order.callbackValue} tick={tick} unit={q} />
              </Row>
            )}
          </>
        ) : (
          <Row label="Price">{isMarket ? <Market /> : <Numeral value={order.price} tick={tick} unit={q} />}</Row>
        )}
        {order.type !== "trailing-stop" && (
          <Row label="Est. total">
            <Numeral value={notional} dp={2} unit={q} />
          </Row>
        )}
        {order.fee !== undefined && (
          <Row label="Est. fee">
            <Numeral value={order.fee} dp={2} unit={q} />
          </Row>
        )}
        {order.estLiqPrice !== undefined && (
          <Row label="Est. liq. price">
            <Numeral value={order.estLiqPrice} tick={tick} unit={q} className="text-amber-600 dark:text-amber-400" />
          </Row>
        )}
      </dl>

      {hasTpsl && tpsl && (
        <dl className="flex flex-col gap-1.5 border-t border-border pt-4">
          <p className="mb-0.5 font-medium text-foreground">TP/SL · {tpsl.scope === "partial" ? "Partial position" : "Entire position"}</p>
          <Row label="Quantity">
            {tpsl.scope === "partial" ? <Numeral value={tpsl.quantity} dp={baseDp} pad={false} unit={base} /> : <span>Entire position</span>}
          </Row>
          <Row label="TP trigger price">{legPrice(tpsl.tpTriggerPrice, null, "up", false)}</Row>
          <Row label="TP order price">{legPrice(tpsl.tpTriggerPrice, tpsl.tpOrderPrice, "up", true)}</Row>
          <Row label="SL trigger price">{legPrice(tpsl.slTriggerPrice, null, "down", false)}</Row>
          <Row label="SL order price">{legPrice(tpsl.slTriggerPrice, tpsl.slOrderPrice, "down", true)}</Row>
        </dl>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ confirm dialog */

type DialogShellProps = {
  /** Optional trigger element; omit and drive `open` from your submit handler. */
  trigger?: ReactElement;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  title?: ReactNode;
};

export interface OrderConfirmDialogProps extends DialogShellProps, OrderConfirmDetailsProps {
  onConfirm?: () => void;
  onCancel?: () => void;
  submitting?: boolean;
  confirmLabel?: ReactNode;
  /** Show the "Don't show this again" checkbox. */
  showDontShowAgain?: boolean;
  defaultDontShowAgain?: boolean;
  /** Persist the preference here — the component only keeps it in local state. */
  onDontShowAgainChange?: (checked: boolean) => void;
}

/** A dialog summarising an order before it is sent. */
export function OrderConfirmDialog({
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  title = "Confirm order",
  onConfirm,
  onCancel,
  submitting,
  confirmLabel = "Confirm",
  showDontShowAgain = true,
  defaultDontShowAgain = false,
  onDontShowAgainChange,
  ...details
}: OrderConfirmDialogProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [skip, setSkip] = useState(defaultDontShowAgain);
  const skipId = useId();

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        if (!o) onCancel?.();
        setOpen(o);
      }}
    >
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="gap-4 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          <DialogDescription className="sr-only">Review the order before it is sent.</DialogDescription>
        </DialogHeader>
        <OrderConfirmDetails {...details} />
        {showDontShowAgain && (
          <div className="flex items-center gap-2">
            <Checkbox
              id={skipId}
              checked={skip}
              onCheckedChange={(c) => {
                setSkip(c);
                onDontShowAgainChange?.(c);
              }}
            />
            <label htmlFor={skipId} className="text-xs text-muted-foreground select-none">
              Don’t show this again
            </label>
          </div>
        )}
        <ConfirmActions
          side={details.order.side}
          submitting={submitting}
          confirmLabel={confirmLabel}
          onCancel={() => {
            onCancel?.();
            setOpen(false);
          }}
          onConfirm={() => {
            onConfirm?.();
            if (open === undefined) setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function ConfirmActions({
  side,
  submitting,
  confirmLabel,
  onCancel,
  onConfirm,
  disabled,
}: {
  side?: OrderSide;
  submitting?: boolean;
  confirmLabel: ReactNode;
  onCancel: () => void;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  return (
    <div className="grid grid-cols-2 gap-2">
      <Button variant="tonal" onClick={onCancel} disabled={submitting}>
        Cancel
      </Button>
      <Button
        disabled={disabled || submitting}
        onClick={onConfirm}
        className={cn(side && SIDE_FILL[side])}
      >
        {submitting && <Spinner />}
        {confirmLabel}
      </Button>
    </div>
  );
}

/* ------------------------------------------------------------ scaled */

export type ScaledChildOrder = { price: number; quantity: number };

export interface ScaledOrderConfirmDialogProps extends DialogShellProps {
  symbol: string;
  side: OrderSide;
  /** Child limit orders, start price first. */
  orders: ScaledChildOrder[];
  tick?: number;
  baseDp?: number;
  /** Best ask / bid — child orders that would cross the book get a warning. */
  bestAsk?: number | null;
  bestBid?: number | null;
  onConfirm?: () => void;
  onCancel?: () => void;
  submitting?: boolean;
  confirmLabel?: ReactNode;
}

/** Confirms a scaled order with every child order listed. Totals are summed from `orders`. */
export function ScaledOrderConfirmDialog({
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  title = "Confirm scaled order",
  symbol,
  side,
  orders,
  tick,
  baseDp = 4,
  bestAsk,
  bestBid,
  onConfirm,
  onCancel,
  submitting,
  confirmLabel = "Confirm",
}: ScaledOrderConfirmDialogProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const { base, quote } = parseSymbol(symbol);
  const q = quote || "USDC";
  const tone = sideTone(side);
  const totalQty = orders.reduce((s, o) => s + o.quantity, 0);
  const notional = orders.reduce((s, o) => s + o.quantity * o.price, 0);
  const crosses = (price: number) => (side === "buy" ? bestAsk != null && price >= bestAsk : bestBid != null && price <= bestBid);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        if (!o) onCancel?.();
        setOpen(o);
      }}
    >
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="gap-4 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-base font-semibold">{title}</DialogTitle>
          <DialogDescription className="sr-only">Review each child order of the scaled order.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center justify-between gap-2">
          <SymbolDisplay symbol={symbol} size="sm" className="text-sm" />
          <span className="flex gap-1">
            <SymbolBadge className="h-5 px-1.5 text-[11px]">Scaled</SymbolBadge>
            <SymbolBadge className={cn("h-5 px-1.5 text-[11px]", TONE_BG[tone], TONE_TEXT[tone])}>{side === "buy" ? "Buy" : "Sell"}</SymbolBadge>
          </span>
        </div>
        <ScrollArea className={cn("rounded-xl bg-container", orders.length > 6 ? "h-72" : undefined)}>
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-container text-[11px] text-muted-foreground">
              <tr>
                <th scope="col" className="py-2 pl-3 text-left font-normal">
                  #
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  Price ({q})
                </th>
                <th scope="col" className="py-2 pr-3 text-right font-normal">
                  Qty ({base})
                </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i} className="border-t border-border">
                  <th scope="row" aria-label={`Order ${i + 1}`} className="py-2 pl-3 text-left font-normal">
                    <span className="flex items-center gap-2">
                      <span aria-hidden className={cn("h-5 w-0.5 rounded-full", side === "buy" ? "bg-emerald-500" : "bg-rose-500")} />
                      <span className="font-mono text-muted-foreground tabular-nums">{i + 1}</span>
                    </span>
                  </th>
                  <td className="py-2 text-right">
                    <span className="inline-flex items-center justify-end gap-1">
                      {crosses(o.price) && (
                        <Tooltip>
                          <TooltipTrigger
                            render={<button type="button" aria-label="Fills immediately" />}
                            className="focus-ring grid size-4 place-items-center rounded-full text-amber-600 dark:text-amber-400"
                          >
                            <TriangleAlertIcon className="size-3" />
                          </TooltipTrigger>
                          <TooltipContent className="max-w-60">This order will be filled immediately at the current market price.</TooltipContent>
                        </Tooltip>
                      )}
                      <Numeral value={o.price} tick={tick} />
                    </span>
                  </td>
                  <td className="py-2 pr-3 text-right">
                    <Numeral value={o.quantity} dp={baseDp} pad={false} className={TONE_TEXT[tone]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollArea>
        <dl className="flex flex-col gap-1.5 text-xs">
          <Row label="Total orders">
            <span className="font-mono tabular-nums">{orders.length}</span>
          </Row>
          <Row label="Total quantity">
            <Numeral value={totalQty} dp={baseDp} pad={false} unit={base} />
          </Row>
          <Row label="Notional">
            <Numeral value={notional} dp={2} unit={q} />
          </Row>
        </dl>
        <ConfirmActions
          side={side}
          submitting={submitting}
          confirmLabel={confirmLabel}
          disabled={orders.length === 0}
          onCancel={() => {
            onCancel?.();
            setOpen(false);
          }}
          onConfirm={() => {
            onConfirm?.();
            if (open === undefined) setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------ market notice */

export interface MarketNoticeDialogProps extends DialogShellProps {
  /** Body copy. Defaults to the community-listed market notice. */
  children?: ReactNode;
  acknowledgeLabel?: ReactNode;
  /** Called once the user ticks the box and confirms — remember the acknowledgement here. */
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmLabel?: ReactNode;
}

/** A risk notice that must be acknowledged before the first order on a market. */
export function MarketNoticeDialog({
  trigger,
  open,
  defaultOpen = false,
  onOpenChange,
  title = "Community-listed market",
  children,
  acknowledgeLabel = "I understand this is a community-listed market and accept the risks.",
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
}: MarketNoticeDialogProps) {
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(o) => {
        if (!o) onCancel?.();
        setOpen(o);
      }}
    >
      {trigger && <DialogTrigger render={trigger} />}
      <DialogContent className="gap-4 sm:max-w-md">
        <MarketNoticeBody
          title={title}
          acknowledgeLabel={acknowledgeLabel}
          confirmLabel={confirmLabel}
          onConfirm={() => {
            onConfirm?.();
            setOpen(false);
          }}
        >
          {children}
        </MarketNoticeBody>
      </DialogContent>
    </Dialog>
  );
}

function MarketNoticeBody({ title, children, acknowledgeLabel, confirmLabel, onConfirm }: { title: ReactNode; children?: ReactNode; acknowledgeLabel: ReactNode; confirmLabel: ReactNode; onConfirm: () => void }) {
  const [checked, setChecked] = useState(false);
  const id = useId();
  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-base font-semibold">
          <TriangleAlertIcon aria-hidden className="size-4 text-amber-600 dark:text-amber-400" />
          {title}
        </DialogTitle>
        <DialogDescription render={<div />} className="flex flex-col gap-2.5 text-[13px]">
          {children ?? (
            <>
              <p>This market was listed by a third-party deployer through permissionless listing.</p>
              <p>It is not created, reviewed or endorsed by the venue. Such markets may have low liquidity, high volatility, incomplete information or increased liquidation risk.</p>
              <p>Review the deployer’s documentation and trade at your own risk.</p>
            </>
          )}
        </DialogDescription>
      </DialogHeader>
      <div className="flex items-start gap-2 rounded-xl bg-warning-container/60 p-3">
        <Checkbox id={id} checked={checked} onCheckedChange={setChecked} className="mt-0.5" />
        <label htmlFor={id} className="text-xs leading-relaxed select-none">
          {acknowledgeLabel}
        </label>
      </div>
      <Button disabled={!checked} onClick={onConfirm} className="w-full">
        {confirmLabel}
      </Button>
    </>
  );
}
