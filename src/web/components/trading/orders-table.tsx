import { CheckIcon, ClipboardListIcon, PencilIcon, Share2Icon, XIcon } from "lucide-react";
import { useCallback, useId, useRef, useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, SymbolDisplay } from "@/components/trading/token-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Empty, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { formatNumber, parseSymbol, TONE_TEXT, type OrderSide } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type OrderStatus = "open" | "partially_filled" | "filled" | "cancelled" | "rejected";
export type OrderKind = "limit" | "market" | "stop_limit" | "stop_market" | "take_profit" | "stop_loss" | "tp_sl" | "trailing_stop";

export interface Order {
  id: string;
  symbol: string;
  side: OrderSide;
  type: OrderKind;
  /** Limit price. `null` / omitted renders "Market". */
  price?: number | null;
  triggerPrice?: number | null;
  /** Average fill price. */
  avgPrice?: number | null;
  /** Order size in base. */
  quantity: number;
  /** Filled size in base. */
  filled?: number;
  status: OrderStatus;
  /** Creation or update time. */
  time: number | Date;
  reduceOnly?: boolean;
  /** Attached bracket take-profit trigger. */
  takeProfitPrice?: number | null;
  /** Attached bracket stop-loss trigger. */
  stopLossPrice?: number | null;
  realizedPnl?: number | null;
  fee?: number | null;
  tick?: number;
  baseDp?: number;
  iconSrc?: string;
  /** Override whether price / quantity can be edited. Defaults to open, non-market orders. */
  editable?: boolean;
}

export type OrderColumn = "symbol" | "side" | "type" | "price" | "avgPrice" | "trigger" | "quantity" | "tpsl" | "pnl" | "fee" | "status" | "time" | "actions";

export interface OrdersTab {
  value: string;
  label: ReactNode;
  /** Which orders belong to this tab. */
  filter: (order: Order) => boolean;
  columns?: OrderColumn[];
  /** Show the order count next to the label. */
  showCount?: boolean;
  /** Show the "Cancel all" button for this tab. */
  cancelAll?: boolean;
  /** Empty state text for this tab. */
  emptyText?: ReactNode;
}

export type OrderEdit = { price: number | null; quantity: number; triggerPrice?: number | null };

const isActive = (o: Order) => o.status === "open" || o.status === "partially_filled";
const isTpSl = (o: Order) => o.type === "take_profit" || o.type === "stop_loss" || o.type === "tp_sl";

/** Open, TP/SL, Filled, Cancelled and Order history. Pass your own list to rename, reorder or drop tabs. */
export const DEFAULT_ORDER_TABS: OrdersTab[] = [
  {
    value: "open",
    label: "Open",
    filter: (o) => isActive(o) && !isTpSl(o),
    columns: ["symbol", "side", "type", "price", "trigger", "quantity", "tpsl", "time", "actions"],
    showCount: true,
    cancelAll: true,
    emptyText: "No open orders",
  },
  {
    value: "tpsl",
    label: "TP/SL",
    filter: (o) => isActive(o) && isTpSl(o),
    columns: ["symbol", "side", "type", "trigger", "price", "quantity", "time", "actions"],
    showCount: true,
    cancelAll: true,
    emptyText: "No TP/SL orders",
  },
  {
    value: "filled",
    label: "Filled",
    filter: (o) => o.status === "filled",
    columns: ["symbol", "side", "type", "price", "avgPrice", "quantity", "pnl", "fee", "time", "actions"],
    emptyText: "No filled orders",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    filter: (o) => o.status === "cancelled" || o.status === "rejected",
    columns: ["symbol", "side", "type", "price", "trigger", "quantity", "status", "time"],
    emptyText: "No cancelled orders",
  },
  {
    value: "history",
    label: "Order history",
    filter: () => true,
    columns: ["symbol", "side", "type", "price", "avgPrice", "trigger", "quantity", "status", "time"],
    emptyText: "No orders yet",
  },
];

const KIND_LABEL: Record<OrderKind, string> = {
  limit: "Limit",
  market: "Market",
  stop_limit: "Stop limit",
  stop_market: "Stop market",
  take_profit: "Take profit",
  stop_loss: "Stop loss",
  tp_sl: "TP/SL",
  trailing_stop: "Trailing stop",
};

const STATUS: Record<OrderStatus, { label: string; variant: "info" | "warning" | "success" | "tonal" | "destructive" }> = {
  open: { label: "Pending", variant: "info" },
  partially_filled: { label: "Partially filled", variant: "warning" },
  filled: { label: "Filled", variant: "success" },
  cancelled: { label: "Cancelled", variant: "tonal" },
  rejected: { label: "Rejected", variant: "destructive" },
};

const COLUMN_LABEL: Record<OrderColumn, string> = {
  symbol: "Symbol",
  side: "Side",
  type: "Type",
  price: "Price",
  avgPrice: "Avg. price",
  trigger: "Trigger",
  quantity: "Filled / Qty",
  tpsl: "TP/SL",
  pnl: "Realized PnL",
  fee: "Fee",
  status: "Status",
  time: "Time",
  actions: "Actions",
};

const RIGHT: OrderColumn[] = ["price", "avgPrice", "trigger", "quantity", "pnl", "fee", "actions"];

const pad2 = (n: number) => String(n).padStart(2, "0");
/** `2026-10-22 14:03:11` in local time. */
export function formatOrderTime(time: number | Date) {
  const d = typeof time === "number" ? new Date(time) : time;
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())} ${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
}

const canEdit = (o: Order) => o.editable ?? (isActive(o) && o.type !== "market" && o.type !== "stop_market");
const plain = (value: number | null | undefined, tick?: number, dp?: number) =>
  value == null ? "" : formatNumber(value, "number", dp != null ? { dp, pad: false } : { tick }).replace(/,/g, "");

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

/* ------------------------------------------------------------ cells */

function SideText({ side }: { side: OrderSide }) {
  return <span className={cn("font-medium", TONE_TEXT[side === "buy" ? "up" : "down"])}>{side === "buy" ? "Buy" : "Sell"}</span>;
}

function StatusBadge({ status }: { status: OrderStatus }) {
  const s = STATUS[status];
  return (
    <Badge variant={s.variant} className="h-5 px-2 text-[10px]">
      {s.label}
    </Badge>
  );
}

function IconAction({ label, onClick, children, className }: { label: string; onClick: () => void; children: ReactNode; className?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger
        render={<button type="button" aria-label={label} />}
        aria-label={label}
        onClick={onClick}
        className={cn(
          "focus-ring grid size-6 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-container-high hover:text-foreground [&_svg]:size-3.5",
          className,
        )}
      >
        {children}
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

/** A value that turns into an input with save / discard when its pencil is pressed. */
function EditableValue({ display, initial, label, onSave }: { display: ReactNode; initial: string; label: string; onSave: (value: number) => void }) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(initial);
  const inputRef = useRef<HTMLInputElement>(null);
  const start = () => {
    setText(initial);
    setEditing(true);
    requestAnimationFrame(() => inputRef.current?.select());
  };
  const commit = () => {
    const n = Number(text);
    if (text.trim() !== "" && Number.isFinite(n) && n > 0 && text !== initial) onSave(n);
    setEditing(false);
  };
  if (!editing)
    return (
      <span className="group/edit inline-flex items-center justify-end gap-1">
        {display}
        <IconAction label={`Edit ${label}`} onClick={start} className="size-5 opacity-60 group-hover/edit:opacity-100">
          <PencilIcon />
        </IconAction>
      </span>
    );
  return (
    <span className="inline-flex items-center justify-end gap-0.5">
      <input
        ref={inputRef}
        aria-label={label}
        inputMode="decimal"
        autoComplete="off"
        value={text}
        onChange={(e) => setText(sanitize(e.target.value))}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") setEditing(false);
        }}
        className="h-6 w-24 rounded-md border border-input bg-background px-1.5 text-right font-mono text-xs tabular-nums outline-none focus-visible:border-foreground"
      />
      <IconAction label={`Save ${label}`} onClick={commit} className={TONE_TEXT.up}>
        <CheckIcon />
      </IconAction>
      <IconAction label="Discard" onClick={() => setEditing(false)}>
        <XIcon />
      </IconAction>
    </span>
  );
}

function PriceText({ order, value }: { order: Order; value: number | null | undefined }) {
  return value == null ? <span className="text-muted-foreground">Market</span> : <Numeral value={value} tick={order.tick} />;
}

function QuantityProgress({ order, edit }: { order: Order; edit?: ReactNode }) {
  const filled = order.filled ?? (order.status === "filled" ? order.quantity : 0);
  const pct = order.quantity > 0 ? Math.min(100, (filled / order.quantity) * 100) : 0;
  return (
    <span className="ml-auto flex w-max flex-col items-end gap-1">
      <span className="inline-flex items-center gap-1 font-mono tabular-nums">
        <Numeral value={filled} dp={order.baseDp} pad={false} className="text-muted-foreground" />
        <span className="text-muted-foreground">/</span>
        {edit ?? <Numeral value={order.quantity} dp={order.baseDp} pad={false} />}
      </span>
      <Progress value={pct} aria-label={`${Math.round(pct)}% filled`} className="w-20 [&_[data-slot=progress-track]]:h-1" />
    </span>
  );
}

function TpSlText({ order }: { order: Order }) {
  if (order.takeProfitPrice == null && order.stopLossPrice == null) return <span className="text-muted-foreground">—</span>;
  return (
    <span className="inline-flex flex-col items-end font-mono leading-tight tabular-nums">
      <Numeral value={order.takeProfitPrice} tick={order.tick} className={order.takeProfitPrice != null ? TONE_TEXT.up : "text-muted-foreground"} />
      <Numeral value={order.stopLossPrice} tick={order.tick} className={order.stopLossPrice != null ? TONE_TEXT.down : "text-muted-foreground"} />
    </span>
  );
}

/* ------------------------------------------------------------ edit dialog */

export interface EditOrderDialogProps {
  order: Order | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Latest price shown for reference. */
  markPrice?: number | null;
  quote?: string;
  error?: ReactNode;
  submitting?: boolean;
  onConfirm?: (order: Order, edit: OrderEdit) => void;
}

/** Edit price, trigger and quantity of an open order — used by the mobile cards, usable on its own. */
export function EditOrderDialog({ order, open, onOpenChange, markPrice, quote = "USDC", error, submitting, onConfirm }: EditOrderDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => onOpenChange(next)}>
      <DialogContent className="gap-4 sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit order</DialogTitle>
          <DialogDescription className="sr-only">Change the price or quantity of this order.</DialogDescription>
        </DialogHeader>
        {order && (
          <EditOrderForm
            key={order.id}
            order={order}
            markPrice={markPrice}
            quote={quote}
            error={error}
            submitting={submitting}
            onCancel={() => onOpenChange(false)}
            onConfirm={(edit) => {
              onConfirm?.(order, edit);
              onOpenChange(false);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditField({ id, label, unit, value, onChange, disabled, placeholder }: { id: string; label: string; unit: string; value: string; onChange: (v: string) => void; disabled?: boolean; placeholder?: string }) {
  return (
    <InputGroup className={cn("h-10", disabled && "opacity-60")}>
      <InputGroupAddon>
        <label htmlFor={id} className="text-xs font-normal text-muted-foreground">
          {label}
        </label>
      </InputGroupAddon>
      <InputGroupInput
        id={id}
        inputMode="decimal"
        autoComplete="off"
        disabled={disabled}
        placeholder={placeholder}
        className="text-right font-mono tabular-nums"
        value={value}
        onChange={(e) => onChange(sanitize(e.target.value))}
      />
      <InputGroupAddon align="inline-end" className="pr-3.5 text-xs font-normal">
        {unit}
      </InputGroupAddon>
    </InputGroup>
  );
}

function EditOrderForm({
  order,
  markPrice,
  quote,
  error,
  submitting,
  onCancel,
  onConfirm,
}: {
  order: Order;
  markPrice?: number | null;
  quote: string;
  error?: ReactNode;
  submitting?: boolean;
  onCancel: () => void;
  onConfirm: (edit: OrderEdit) => void;
}) {
  const id = useId();
  const marketPrice = order.price == null;
  const [price, setPrice] = useState(plain(order.price, order.tick));
  const [trigger, setTrigger] = useState(plain(order.triggerPrice, order.tick));
  const [qty, setQty] = useState(plain(order.quantity, undefined, order.baseDp ?? 4));
  const q = Number(qty);
  const valid = qty !== "" && q > 0 && (marketPrice || Number(price) > 0) && !error;
  const base = parseSymbol(order.symbol).base;

  return (
    <div className="flex flex-col gap-3 text-sm">
      <div className="flex items-center justify-between gap-2">
        <SymbolDisplay symbol={order.symbol} iconSrc={order.iconSrc} size="sm" />
        <span className="flex items-center gap-1 text-xs">
          <SymbolBadge>{KIND_LABEL[order.type]}</SymbolBadge>
          <SideText side={order.side} />
        </span>
      </div>
      {markPrice !== undefined && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">Last price</span>
          <Numeral value={markPrice} tick={order.tick} unit={quote} />
        </div>
      )}
      {order.triggerPrice != null && <EditField id={`${id}-trigger`} label="Trigger" unit={quote} value={trigger} onChange={setTrigger} />}
      <EditField id={`${id}-price`} label="Price" unit={quote} value={marketPrice ? "" : price} placeholder={marketPrice ? "Market" : "0.00"} disabled={marketPrice} onChange={setPrice} />
      <EditField id={`${id}-qty`} label="Quantity" unit={base} value={qty} onChange={setQty} />
      {error && <p className="text-[11px] text-destructive">{error}</p>}
      <DialogFooter className="mt-1 flex-row">
        <Button type="button" variant="tonal" className="flex-1" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          className="flex-1"
          disabled={!valid || submitting}
          onClick={() =>
            onConfirm({
              price: marketPrice ? null : Number(price),
              quantity: q,
              ...(order.triggerPrice != null ? { triggerPrice: Number(trigger) } : {}),
            })
          }
        >
          {submitting ? "Saving…" : "Confirm"}
        </Button>
      </DialogFooter>
    </div>
  );
}

/* ------------------------------------------------------------ table + cards */

export interface OrdersTableProps {
  orders: Order[];
  /** Tab definitions. Defaults to `DEFAULT_ORDER_TABS`. */
  tabs?: OrdersTab[];
  tab?: string;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
  /** Called with the new price / quantity after an inline (desktop) or dialog (mobile) edit. */
  onEdit?: (order: Order, edit: OrderEdit) => void;
  onCancel?: (order: Order) => void;
  /** Called from the "Cancel all" button with the tab's orders. */
  onCancelAll?: (tab: string, orders: Order[]) => void;
  /** Share a filled order. */
  onShare?: (order: Order) => void;
  onSymbolClick?: (order: Order) => void;
  /** Latest prices by symbol, shown in the edit dialog. */
  markPrices?: Record<string, number>;
  formatTime?: (time: number | Date) => ReactNode;
  loading?: boolean;
  /** Rendered at the end of the tab bar, e.g. a "hide other symbols" switch. */
  toolbar?: ReactNode;
  className?: string;
}

/** Orders by tab — a table on `md` and up, cards on small screens — with inline edit and cancel. */
export function OrdersTable({
  orders,
  tabs = DEFAULT_ORDER_TABS,
  tab: tabProp,
  defaultTab,
  onTabChange,
  onEdit,
  onCancel,
  onCancelAll,
  onShare,
  onSymbolClick,
  markPrices,
  formatTime = formatOrderTime,
  loading,
  toolbar,
  className,
}: OrdersTableProps) {
  const [tab, setTab] = useControllable(tabProp, defaultTab ?? tabs[0]?.value ?? "", onTabChange);
  const [editing, setEditing] = useState<Order | null>(null);
  const current = tabs.find((t) => t.value === tab) ?? tabs[0];
  const currentOrders = current ? orders.filter(current.filter) : [];

  const symbolNode = (o: Order) => {
    const node = <SymbolDisplay symbol={o.symbol} iconSrc={o.iconSrc} size="xs" badge={o.reduceOnly ? "Reduce" : undefined} />;
    return onSymbolClick ? (
      <button type="button" onClick={() => onSymbolClick(o)} className="focus-ring -mx-1 rounded-md px-1 hover:bg-container-high">
        {node}
      </button>
    ) : (
      node
    );
  };

  const cell = (col: OrderColumn, o: Order): ReactNode => {
    const editable = Boolean(onEdit) && canEdit(o);
    switch (col) {
      case "symbol":
        return symbolNode(o);
      case "side":
        return <SideText side={o.side} />;
      case "type":
        return KIND_LABEL[o.type];
      case "price":
        return editable && o.price != null ? (
          <EditableValue
            display={<PriceText order={o} value={o.price} />}
            initial={plain(o.price, o.tick)}
            label={`${o.symbol} order price`}
            onSave={(price) => onEdit?.(o, { price, quantity: o.quantity })}
          />
        ) : (
          <PriceText order={o} value={o.price} />
        );
      case "avgPrice":
        return <Numeral value={o.avgPrice} tick={o.tick} />;
      case "trigger":
        return <Numeral value={o.triggerPrice} tick={o.tick} />;
      case "quantity":
        return (
          <QuantityProgress
            order={o}
            edit={
              editable ? (
                <EditableValue
                  display={<Numeral value={o.quantity} dp={o.baseDp} pad={false} />}
                  initial={plain(o.quantity, undefined, o.baseDp ?? 4)}
                  label={`${o.symbol} order quantity`}
                  onSave={(quantity) => onEdit?.(o, { price: o.price ?? null, quantity })}
                />
              ) : undefined
            }
          />
        );
      case "tpsl":
        return <TpSlText order={o} />;
      case "pnl":
        return <Numeral value={o.realizedPnl} dp={2} coloring showSign />;
      case "fee":
        return <Numeral value={o.fee} dp={4} pad={false} className="text-muted-foreground" />;
      case "status":
        return <StatusBadge status={o.status} />;
      case "time":
        return <span className="font-mono text-muted-foreground tabular-nums">{formatTime(o.time)}</span>;
      case "actions":
        return (
          <span className="inline-flex items-center justify-end gap-1.5">
            {o.status === "filled" && onShare && (
              <IconAction label={`Share ${o.symbol} order`} onClick={() => onShare(o)}>
                <Share2Icon />
              </IconAction>
            )}
            {isActive(o) && onCancel && (
              <Button variant="outline" size="xs" className="h-6 px-2.5 text-[11px]" onClick={() => onCancel(o)}>
                Cancel
              </Button>
            )}
          </span>
        );
    }
  };

  const renderPanel = (t: OrdersTab) => {
    const rows = orders.filter(t.filter);
    const allCols = t.columns ?? DEFAULT_ORDER_TABS[0].columns!;
    const cols = allCols.filter((c) => c !== "actions" || onCancel || onShare);
    if (!loading && rows.length === 0)
      return (
        <Empty className="border-0 py-10">
          <EmptyHeader>
            <EmptyMedia>
              <ClipboardListIcon />
            </EmptyMedia>
            <EmptyTitle className="text-sm">{t.emptyText ?? "No orders"}</EmptyTitle>
            <EmptyDescription className="text-xs">Orders will show up here as soon as you place them.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    return (
      <>
        <div className="hidden md:block">
          <Table className="text-xs">
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                {cols.map((c) => (
                  <TableHead key={c} scope="col" className={cn("h-9 text-[11px]", RIGHT.includes(c) && "text-right")}>
                    {c === "actions" ? <span className="sr-only">{COLUMN_LABEL[c]}</span> : COLUMN_LABEL[c]}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading && rows.length === 0
                ? Array.from({ length: 3 }, (_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={cols.length}>
                        <Skeleton className="h-5 w-full" />
                      </TableCell>
                    </TableRow>
                  ))
                : rows.map((o) => (
                    <TableRow key={o.id} className={cn(!isActive(o) && o.status !== "filled" && "text-muted-foreground")}>
                      {cols.map((c) => (
                        <TableCell key={c} className={cn("h-12 py-1.5", RIGHT.includes(c) && "text-right")}>
                          {cell(c, o)}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex flex-col gap-2 p-2 md:hidden">
          {loading && rows.length === 0
            ? Array.from({ length: 2 }, (_, i) => <Skeleton key={i} className="h-36 w-full rounded-xl" />)
            : rows.map((o) => (
                <OrderCard
                  key={o.id}
                  order={o}
                  formatTime={formatTime}
                  symbol={symbolNode(o)}
                  onEdit={onEdit && canEdit(o) ? () => setEditing(o) : undefined}
                  onCancel={onCancel && isActive(o) ? () => onCancel(o) : undefined}
                  onShare={onShare && o.status === "filled" ? () => onShare(o) : undefined}
                />
              ))}
        </div>
      </>
    );
  };

  return (
    <div data-slot="orders-table" className={cn("flex w-full flex-col rounded-2xl border border-border bg-background", className)}>
      <Tabs value={tab} onValueChange={(v) => setTab(String(v))} className="gap-0">
        <div className="flex items-center justify-between gap-3 border-b border-border px-3">
          <div className="min-w-0 flex-1 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <TabsList variant="line" className="border-0">
              {tabs.map((t) => {
                const count = t.showCount ? orders.filter(t.filter).length : null;
                return (
                  <TabsTrigger key={t.value} value={t.value} className="text-xs">
                    {t.label}
                    {count != null && count > 0 && <span className="font-mono text-muted-foreground tabular-nums">({count})</span>}
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            {toolbar}
            {current?.cancelAll && onCancelAll && (
              <Button variant="outline" size="xs" disabled={currentOrders.length === 0} onClick={() => onCancelAll(current.value, currentOrders)}>
                Cancel all
              </Button>
            )}
          </div>
        </div>
        {tabs.map((t) => (
          <TabsContent key={t.value} value={t.value}>
            {renderPanel(t)}
          </TabsContent>
        ))}
      </Tabs>
      <EditOrderDialog
        order={editing}
        open={editing != null}
        onOpenChange={(open) => !open && setEditing(null)}
        markPrice={editing ? markPrices?.[editing.symbol] : undefined}
        onConfirm={onEdit}
      />
    </div>
  );
}

function CardField({ label, children, align = "start" }: { label: ReactNode; children: ReactNode; align?: "start" | "center" | "end" }) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-0.5", align === "center" && "items-center text-center", align === "end" && "items-end text-right")}>
      <span className="text-[11px] text-muted-foreground">{label}</span>
      <span className="font-mono text-xs tabular-nums">{children}</span>
    </div>
  );
}

function OrderCard({
  order: o,
  symbol,
  formatTime,
  onEdit,
  onCancel,
  onShare,
}: {
  order: Order;
  symbol: ReactNode;
  formatTime: (time: number | Date) => ReactNode;
  onEdit?: () => void;
  onCancel?: () => void;
  onShare?: () => void;
}) {
  const filled = o.filled ?? (o.status === "filled" ? o.quantity : 0);
  return (
    <article data-slot="order-card" className="flex flex-col gap-2.5 rounded-xl bg-container p-3">
      <header className="flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          {symbol}
          <span className="font-mono text-[11px] text-muted-foreground tabular-nums">{formatTime(o.time)}</span>
        </div>
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="flex items-center gap-1.5">
            <SideText side={o.side} />
            <span className="text-muted-foreground">{KIND_LABEL[o.type]}</span>
          </span>
          <StatusBadge status={o.status} />
        </div>
      </header>
      <div className="h-px bg-border" />
      <div className="grid grid-cols-3 gap-x-2 gap-y-2">
        <CardField label="Qty">
          <Numeral value={o.quantity} dp={o.baseDp} pad={false} />
        </CardField>
        <CardField label="Filled" align="center">
          <Numeral value={filled} dp={o.baseDp} pad={false} />
        </CardField>
        <CardField label="Price" align="end">
          <PriceText order={o} value={o.price} />
        </CardField>
        {o.triggerPrice != null && (
          <CardField label="Trigger">
            <Numeral value={o.triggerPrice} tick={o.tick} />
          </CardField>
        )}
        {o.avgPrice != null && (
          <CardField label="Avg. price" align={o.triggerPrice != null ? "center" : "start"}>
            <Numeral value={o.avgPrice} tick={o.tick} />
          </CardField>
        )}
      </div>
      {(o.takeProfitPrice != null || o.stopLossPrice != null) && (
        <div className="flex items-center justify-between rounded-lg bg-container-high px-2.5 py-1.5 text-xs">
          <span className="text-muted-foreground">TP/SL</span>
          <span className="font-mono tabular-nums">
            <Numeral value={o.takeProfitPrice} tick={o.tick} className={TONE_TEXT.up} />
            <span className="px-1 text-muted-foreground">/</span>
            <Numeral value={o.stopLossPrice} tick={o.tick} className={TONE_TEXT.down} />
          </span>
        </div>
      )}
      {(onEdit || onCancel || onShare) && (
        <div className="grid grid-cols-3 gap-2">
          <span />
          {onEdit ? (
            <Button variant="outline" size="xs" onClick={onEdit}>
              Edit
            </Button>
          ) : (
            <span />
          )}
          {onCancel ? (
            <Button variant="outline" size="xs" onClick={onCancel}>
              Cancel
            </Button>
          ) : onShare ? (
            <Button variant="outline" size="xs" onClick={onShare}>
              <Share2Icon /> Share
            </Button>
          ) : null}
        </div>
      )}
    </article>
  );
}
