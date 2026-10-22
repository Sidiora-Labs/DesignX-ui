import {
  BellIcon,
  CircleCheckIcon,
  CircleDashedIcon,
  CircleSlashIcon,
  CircleXIcon,
  PlusCircleIcon,
  ShieldAlertIcon,
  TargetIcon,
  TriangleAlertIcon,
  XIcon,
} from "lucide-react";
import { useState, type ReactElement, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/sonner";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, formatPrice, parseSymbol, TONE_TEXT, type OrderSide } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type TradeNotificationKind =
  | "opened"
  | "filled"
  | "partially-filled"
  | "cancelled"
  | "rejected"
  | "liquidation-warning"
  | "take-profit"
  | "stop-loss";

export type TradeNotificationData = {
  kind: TradeNotificationKind;
  /** `PERP_BTC_USDC`, `BTC-PERP`… */
  symbol: string;
  side?: OrderSide;
  /** e.g. "Limit", "Market", "Stop market". */
  orderType?: ReactNode;
  /** Order quantity in base units. */
  quantity?: number | null;
  /** Executed quantity — shown as `filled / quantity` for fills. */
  filledQuantity?: number | null;
  /** Average fill, limit or trigger price. */
  price?: number | null;
  /** Realized PnL — shown for TP / SL closes. */
  pnl?: number | null;
  /** Liquidation warnings: margin ratio as a fraction (0.92 = 92%). */
  marginRatio?: number | null;
  /** Liquidation warnings: estimated liquidation price. */
  liquidationPrice?: number | null;
  /** Cancel / reject reason. */
  reason?: ReactNode;
  /** Override the generated title. */
  title?: ReactNode;
  /** Override the generated detail line. */
  message?: ReactNode;
  /** When it happened — rendered as a clock time. */
  time?: number | Date;
  tick?: number;
  /** Decimal places for quantities. */
  baseDp?: number;
};

export type TradeNotificationAction = { label: ReactNode; onClick: () => void };

/* ------------------------------------------------------------ helpers */

const KIND: Record<TradeNotificationKind, { title: string; icon: typeof BellIcon; tone: string }> = {
  opened: { title: "Order placed", icon: PlusCircleIcon, tone: "bg-primary/12 text-primary" },
  filled: { title: "Order filled", icon: CircleCheckIcon, tone: "bg-emerald-500/14 text-emerald-700 dark:text-emerald-400" },
  "partially-filled": { title: "Order partially filled", icon: CircleDashedIcon, tone: "bg-sky-500/14 text-sky-700 dark:text-sky-400" },
  cancelled: { title: "Order cancelled", icon: CircleSlashIcon, tone: "bg-container-high text-muted-foreground" },
  rejected: { title: "Order rejected", icon: CircleXIcon, tone: "bg-destructive-container text-destructive" },
  "liquidation-warning": { title: "Liquidation warning", icon: TriangleAlertIcon, tone: "bg-warning-container text-warning" },
  "take-profit": { title: "Take profit triggered", icon: TargetIcon, tone: "bg-emerald-500/14 text-emerald-700 dark:text-emerald-400" },
  "stop-loss": { title: "Stop loss triggered", icon: ShieldAlertIcon, tone: "bg-rose-500/14 text-rose-600 dark:text-rose-400" },
};

const pad2 = (n: number) => String(n).padStart(2, "0");
function clock(t: number | Date) {
  const d = new Date(t);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

function SymbolText({ symbol }: { symbol: string }) {
  const { base, type } = parseSymbol(symbol);
  return (
    <span className="font-medium text-foreground">
      {base}
      {type === "PERP" ? "-PERP" : ""}
    </span>
  );
}

function Detail(data: TradeNotificationData) {
  const { kind, symbol, side, orderType, quantity, filledQuantity, price, pnl, marginRatio, liquidationPrice, reason, tick, baseDp } = data;
  const qty = (v: number) => formatNumber(v, "number", { dp: baseDp ?? 4, pad: false });
  const sideNode = side && <span className={cn("font-medium", TONE_TEXT[side === "buy" ? "up" : "down"])}>{side === "buy" ? "Buy" : "Sell"}</span>;

  if (kind === "liquidation-warning") {
    return (
      <span className="flex flex-col gap-0.5">
        <span>
          Your <SymbolText symbol={symbol} /> position is close to liquidation.
        </span>
        <span className="flex flex-wrap gap-x-3 font-mono tabular-nums">
          {marginRatio != null && (
            <span>
              <span className="font-sans text-muted-foreground">Margin ratio </span>
              <span className="text-warning">{formatNumber(marginRatio, "percent", { dp: 1 })}</span>
            </span>
          )}
          {liquidationPrice != null && (
            <span>
              <span className="font-sans text-muted-foreground">Liq. price </span>
              <span className="text-foreground">{formatPrice(liquidationPrice, tick)}</span>
            </span>
          )}
        </span>
      </span>
    );
  }

  const parts: ReactNode[] = [];
  if (sideNode) parts.push(sideNode);
  parts.push(<SymbolText key="s" symbol={symbol} />);
  if (orderType) parts.push(<span key="t">{orderType}</span>);
  const showFill = (kind === "filled" || kind === "partially-filled") && filledQuantity != null;
  if (showFill) {
    parts.push(
      <span key="q" className="font-mono text-foreground tabular-nums">
        {qty(filledQuantity)}
        {quantity != null && <span className="text-muted-foreground"> / {qty(quantity)}</span>}
      </span>,
    );
  } else if (quantity != null) {
    parts.push(
      <span key="q" className="font-mono text-foreground tabular-nums">
        {qty(quantity)}
      </span>,
    );
  }
  if (price != null)
    parts.push(
      <span key="p" className="font-mono tabular-nums">
        @ <span className="text-foreground">{formatPrice(price, tick)}</span>
      </span>,
    );

  return (
    <span className="flex flex-col gap-0.5">
      <span className="flex flex-wrap items-baseline gap-x-1.5">{parts.map((p, i) => <span key={i}>{p}</span>)}</span>
      {(kind === "take-profit" || kind === "stop-loss") && pnl != null && (
        <span className="flex items-baseline gap-1">
          <span className="text-muted-foreground">Realized PnL</span>
          <Numeral value={pnl} rule="usd" coloring showSign />
        </span>
      )}
      {(kind === "cancelled" || kind === "rejected") && reason && <span className="text-muted-foreground">{reason}</span>}
    </span>
  );
}

/* ------------------------------------------------------------ content */

export interface TradeNotificationProps extends TradeNotificationData {
  /**
   * `card` draws its own surface (inline use), `plain` is content-only for a toast container,
   * `row` is the compact list row used by `NotificationCenter`.
   */
  chrome?: "card" | "plain" | "row";
  /** Shows a close button. */
  onDismiss?: () => void;
  /** A follow-up, e.g. "Add margin" or "View order". */
  action?: TradeNotificationAction;
  className?: string;
}

/** Order filled, partially filled, cancelled, rejected, TP / SL and liquidation alerts. */
export function TradeNotification({ chrome = "card", onDismiss, action, className, ...data }: TradeNotificationProps) {
  const meta = KIND[data.kind];
  const Icon = meta.icon;
  const fillShare =
    data.kind === "partially-filled" && data.filledQuantity != null && data.quantity ? Math.min(1, Math.max(0, data.filledQuantity / data.quantity)) : null;

  return (
    <div
      data-slot="trade-notification"
      data-kind={data.kind}
      className={cn(
        "relative flex w-full gap-3 text-left",
        chrome === "card" && "rounded-xl border border-outline-variant bg-popover p-3.5 text-popover-foreground shadow-float",
        chrome === "row" && "px-3 py-2.5",
        className,
      )}
    >
      <span className={cn("grid shrink-0 place-items-center rounded-full", chrome === "row" ? "size-7" : "size-8", meta.tone)}>
        <Icon className={chrome === "row" ? "size-3.5" : "size-4"} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-2 pr-0.5">
          <span className="text-sm font-medium">{data.title ?? meta.title}</span>
          {data.time != null && <span className="shrink-0 font-mono text-[11px] text-muted-foreground tabular-nums">{clock(data.time)}</span>}
        </div>
        <div className="text-xs text-muted-foreground">{data.message ?? <Detail {...data} />}</div>
        {fillShare != null && (
          <div className="mt-0.5 h-1 overflow-hidden rounded-full bg-container-highest" aria-hidden="true">
            <div className="h-full rounded-full bg-sky-500" style={{ width: `${fillShare * 100}%` }} />
          </div>
        )}
        {action && chrome !== "row" && (
          <div className="mt-1">
            <Button size="xs" variant={data.kind === "liquidation-warning" ? "default" : "tonal"} onClick={action.onClick}>
              {action.label}
            </Button>
          </div>
        )}
      </div>
      {onDismiss && (
        <button
          type="button"
          aria-label="Dismiss notification"
          onClick={onDismiss}
          className={cn(
            "focus-ring -mt-1 -mr-1 grid size-6 shrink-0 place-items-center self-start rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground",
          )}
        >
          <XIcon className="size-3.5" />
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------ toast helper */

type ToastOptions = Parameters<typeof toast.custom>[1];

/**
 * Show a trade notification in the Sonner stack. Returns the toast id.
 * Liquidation warnings stay up longer by default.
 */
export function showTradeNotification(data: TradeNotificationData & { action?: TradeNotificationAction }, options?: ToastOptions) {
  return toast.custom(
    (id) => (
      <TradeNotification
        {...data}
        chrome="plain"
        action={
          data.action && {
            label: data.action.label,
            onClick: () => {
              data.action?.onClick();
              toast.dismiss(id);
            },
          }
        }
        onDismiss={() => toast.dismiss(id)}
      />
    ),
    { duration: data.kind === "liquidation-warning" ? 12_000 : 5_000, ...options },
  );
}

/* ------------------------------------------------------------ center */

export type TradeNotificationItem = TradeNotificationData & {
  id: string;
  read?: boolean;
};

export interface NotificationCenterProps {
  items: TradeNotificationItem[];
  onItemClick?: (item: TradeNotificationItem) => void;
  onMarkAllRead?: () => void;
  onClear?: () => void;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Custom trigger. Defaults to a bell button with an unread badge. */
  trigger?: ReactElement;
  title?: ReactNode;
  emptyMessage?: ReactNode;
  align?: "start" | "center" | "end";
  className?: string;
}

/** A bell with an unread badge that opens your recent trade notifications. */
export function NotificationCenter({
  items,
  onItemClick,
  onMarkAllRead,
  onClear,
  open,
  defaultOpen,
  onOpenChange,
  trigger,
  title = "Notifications",
  emptyMessage = "You're all caught up",
  align = "end",
  className,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all");
  const unread = items.filter((i) => !i.read).length;
  const shown = filter === "unread" ? items.filter((i) => !i.read) : items;

  return (
    <Popover open={open} defaultOpen={defaultOpen} onOpenChange={(o) => onOpenChange?.(o)}>
      <PopoverTrigger
        render={
          trigger ?? (
            <Button variant="ghost" size="icon-sm" aria-label={unread ? `Notifications, ${unread} unread` : "Notifications"} className="relative">
              <BellIcon className="size-[18px]" />
              {unread > 0 && (
                <span className="absolute -top-0.5 -right-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] leading-none font-semibold text-primary-foreground tabular-nums">
                  {unread > 9 ? "9+" : unread}
                </span>
              )}
            </Button>
          )
        }
      />
      <PopoverContent align={align} className={cn("flex w-[360px] max-w-[calc(100vw-1rem)] flex-col p-0", className)}>
        <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-2">
          <PopoverTitle className="flex items-center gap-2">
            {title}
            {unread > 0 && <span className="rounded-full bg-primary/12 px-1.5 text-[11px] font-medium text-primary tabular-nums">{unread}</span>}
          </PopoverTitle>
          {onMarkAllRead && unread > 0 && (
            <button type="button" onClick={onMarkAllRead} className="focus-ring rounded-sm text-xs font-medium text-primary hover:underline">
              Mark all as read
            </button>
          )}
        </div>
        <div className="px-3 pb-2">
          <Tabs value={filter} onValueChange={(v) => setFilter(v as "all" | "unread")}>
            <TabsList aria-label="Filter notifications">
              <TabsTrigger value="all" className="h-7 px-3 text-xs">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="h-7 px-3 text-xs">
                Unread
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <ScrollArea className="max-h-96 border-t border-outline-variant" fade>
          {shown.length === 0 ? (
            <p className="px-4 py-10 text-center text-xs text-muted-foreground">{emptyMessage}</p>
          ) : (
            <ul className="flex flex-col py-1">
              {shown.map((item) => {
                const { id, read, ...data } = item;
                const label = `${typeof data.title === "string" ? data.title : KIND[data.kind].title}, ${parseSymbol(data.symbol).base}${read ? "" : ", unread"}`;
                return (
                  <li key={id} className={cn("relative mx-1 rounded-lg transition-colors", !read && "bg-primary/[0.04]", onItemClick && "hover:bg-container")}>
                    <TradeNotification {...data} chrome="row" className={cn(!read && "pr-6")} />
                    {onItemClick && (
                      <button type="button" aria-label={label} onClick={() => onItemClick(item)} className="focus-ring absolute inset-0 rounded-lg" />
                    )}
                    {!read && <span aria-hidden="true" className="pointer-events-none absolute top-1/2 right-3 size-1.5 -translate-y-1/2 rounded-full bg-primary" />}
                    {!read && !onItemClick && <span className="sr-only">Unread</span>}
                  </li>
                );
              })}
            </ul>
          )}
        </ScrollArea>
        {onClear && items.length > 0 && (
          <div className="flex justify-end border-t border-outline-variant px-3 py-2">
            <Button size="xs" variant="ghost" onClick={onClear}>
              Clear all
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
}
