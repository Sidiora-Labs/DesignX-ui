import { useState, type ReactNode } from "react";

import { OrderBook, type OrderBookLevel, type OrderBookProps } from "@/components/charts/order-book";
import { RecentTrades, type RecentTradesProps, type Trade } from "@/components/trading/recent-trades";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type OrderBookTradesTab = "book" | "trades";

export interface OrderBookTradesProps {
  bids: readonly OrderBookLevel[];
  asks: readonly OrderBookLevel[];
  trades: readonly Trade[];
  /** Your fills — adds a "My trades" tab inside the trades view. */
  myTrades?: readonly Trade[];
  /** Levels per side of the book. */
  levels?: number;
  /** Last traded price for the spread row. */
  lastPrice?: number;
  /** e.g. `BTC`. */
  base?: string;
  /** e.g. `USDC`. */
  quote?: string;
  /** Price increment — formats both the book and the tape. */
  tick?: number;
  /** Decimal places for sizes. */
  sizeDp?: number;
  /** `tabs` stacks the two behind tabs; `columns` shows them side by side. */
  layout?: "tabs" | "columns";
  tab?: OrderBookTradesTab;
  defaultTab?: OrderBookTradesTab;
  onTabChange?: (tab: OrderBookTradesTab) => void;
  onTradeClick?: (trade: Trade) => void;
  /** Extra props for the order book. */
  orderBookProps?: Partial<Omit<OrderBookProps, "bids" | "asks">>;
  /** Extra props for the trades tape. */
  tradesProps?: Partial<Omit<RecentTradesProps, "trades">>;
  /** Rendered at the end of the tab row, e.g. a tick-size select. */
  toolbarEnd?: ReactNode;
  className?: string;
}

const BOOK_RESET = "max-w-none rounded-none border-0 bg-transparent";

/** A panel pairing the Order Book with Recent Trades — tabbed or side by side. */
export function OrderBookTrades({
  bids,
  asks,
  trades,
  myTrades,
  levels = 10,
  lastPrice,
  base,
  quote,
  tick,
  sizeDp = 4,
  layout = "tabs",
  tab: tabProp,
  defaultTab = "book",
  onTabChange,
  onTradeClick,
  orderBookProps,
  tradesProps,
  toolbarEnd,
  className,
}: OrderBookTradesProps) {
  const [innerTab, setInnerTab] = useState(defaultTab);
  const tab = tabProp ?? innerTab;
  const setTab = (t: OrderBookTradesTab) => {
    if (tabProp === undefined) setInnerTab(t);
    onTabChange?.(t);
  };

  const fmtPrice = (v: number) => formatNumber(v, "price", { tick });
  const book = (
    <OrderBook
      bids={bids}
      asks={asks}
      levels={levels}
      lastPrice={lastPrice}
      baseSymbol={base}
      quoteSymbol={quote}
      formatPrice={tick ? fmtPrice : undefined}
      {...orderBookProps}
      className={cn(BOOK_RESET, orderBookProps?.className)}
    />
  );
  const tape = (
    <RecentTrades
      trades={trades}
      myTrades={myTrades}
      base={base}
      quote={quote}
      tick={tick}
      sizeDp={sizeDp}
      onTradeClick={onTradeClick}
      {...tradesProps}
      className={cn("h-full bg-transparent", tradesProps?.className)}
    />
  );

  if (layout === "columns")
    return (
      <div data-slot="orderbook-trades" className={cn("grid auto-rows-fr grid-cols-1 gap-3 sm:grid-cols-2", className)}>
        <section aria-label="Order book" className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-container pt-3">
          <h3 className="px-4 text-sm font-medium">Order book</h3>
          <div className="min-h-0 flex-1 overflow-y-auto">{book}</div>
        </section>
        <section aria-label="Trades" className="flex min-h-0 flex-col overflow-hidden rounded-2xl bg-container pt-3">
          <h3 className="px-3 pb-1 text-sm font-medium">Trades</h3>
          <div className="min-h-0 flex-1">{tape}</div>
        </section>
      </div>
    );

  return (
    <Tabs
      data-slot="orderbook-trades"
      value={tab}
      onValueChange={(v) => setTab(v as OrderBookTradesTab)}
      className={cn("flex min-h-0 flex-col gap-0 overflow-hidden rounded-2xl bg-container", className)}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border px-3">
        <TabsList variant="line" className="h-10 gap-4 border-b-0">
          <TabsTrigger value="book" className="h-10! text-[13px]">
            Order book
          </TabsTrigger>
          <TabsTrigger value="trades" className="h-10! text-[13px]">
            Trades
          </TabsTrigger>
        </TabsList>
        {toolbarEnd && <div className="ml-auto flex items-center gap-1">{toolbarEnd}</div>}
      </div>
      <TabsContent value="book" className="min-h-0 overflow-y-auto">
        {book}
      </TabsContent>
      <TabsContent value="trades" className="min-h-0 pt-1">
        {tape}
      </TabsContent>
    </Tabs>
  );
}
