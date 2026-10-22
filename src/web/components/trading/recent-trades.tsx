import { useState, type CSSProperties, type ReactNode } from "react";

import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatNumber, sideTone, TONE_TEXT, type OrderSide } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type Trade = {
  /** Stable id — new ids animate in. */
  id: string | number;
  price: number;
  /** Size in base units. */
  size: number;
  /** Unix ms. */
  time: number;
  /** Aggressor side. */
  side: OrderSide;
};

export interface RecentTradesProps {
  /** Latest first. */
  trades: readonly Trade[];
  /** Your own fills, latest first. Passing this adds a "My trades" tab. */
  myTrades?: readonly Trade[];
  tab?: "market" | "mine";
  defaultTab?: "market" | "mine";
  onTabChange?: (tab: "market" | "mine") => void;
  /** e.g. `BTC` — shown in the size header. */
  base?: string;
  /** e.g. `USDC` — shown in the price header. */
  quote?: string;
  /** Price increment for formatting. */
  tick?: number;
  /** Decimal places for sizes. */
  sizeDp?: number;
  /** Rows to render. */
  limit?: number;
  formatPrice?: (price: number) => string;
  formatSize?: (size: number) => string;
  formatTime?: (time: number) => string;
  /** Called when a row is clicked — e.g. to fill the order price. */
  onTradeClick?: (trade: Trade) => void;
  loading?: boolean;
  emptyState?: ReactNode;
  className?: string;
}

const pad2 = (n: number) => String(n).padStart(2, "0");
const defaultTime = (t: number) => {
  const d = new Date(t);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}:${pad2(d.getSeconds())}`;
};

/** A tape of the latest fills — price coloured by aggressor side, size and time. */
export function RecentTrades({
  trades,
  myTrades,
  tab: tabProp,
  defaultTab = "market",
  onTabChange,
  base,
  quote,
  tick,
  sizeDp = 4,
  limit = 40,
  formatPrice = (p) => formatNumber(p, "price", { tick }),
  formatSize = (s) => formatNumber(s, "number", { dp: sizeDp }),
  formatTime = defaultTime,
  onTradeClick,
  loading,
  emptyState,
  className,
}: RecentTradesProps) {
  const [innerTab, setInnerTab] = useState(defaultTab);
  const tab = myTrades ? (tabProp ?? innerTab) : "market";
  const setTab = (t: "market" | "mine") => {
    if (tabProp === undefined) setInnerTab(t);
    onTabChange?.(t);
  };
  const rows = (tab === "mine" ? (myTrades ?? []) : trades).slice(0, limit);

  // Rows already on screen at mount (or when the tab changes) don't flash; later arrivals do.
  const allIds = () => new Set([...trades, ...(myTrades ?? [])].map((t) => t.id));
  const [baseline, setBaseline] = useState(() => ({ tab, ids: allIds() }));
  if (baseline.tab !== tab) setBaseline({ tab, ids: allIds() });

  const header = (
    <tr>
      <th scope="col" className="h-8 pl-3 text-left font-normal">
        Price{quote && ` (${quote})`}
      </th>
      <th scope="col" className="h-8 text-right font-normal">
        Size{base && ` (${base})`}
      </th>
      <th scope="col" className="h-8 pr-3 text-right font-normal">
        Time
      </th>
    </tr>
  );

  return (
    <div data-slot="recent-trades" className={cn("flex min-h-0 flex-col bg-background", className)}>
      <style>{`@keyframes dx-trade-flash{from{background-color:var(--trade-flash)}}`}</style>
      {myTrades && (
        <div className="shrink-0 px-3">
          <Tabs value={tab} onValueChange={(v) => setTab(v as "market" | "mine")} className="gap-0">
            <TabsList variant="line" className="h-9 gap-4 border-b-0">
              <TabsTrigger value="market" className="h-9! text-xs">
                Market
              </TabsTrigger>
              <TabsTrigger value="mine" className="h-9! text-xs">
                My trades
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-inherit">
        <table className="w-full table-fixed border-separate border-spacing-0 bg-inherit font-mono text-xs tabular-nums">
          <caption className="sr-only">{tab === "mine" ? "My trades" : "Recent trades"}</caption>
          <thead className="sticky top-0 z-[1] bg-inherit font-sans text-[11px] text-muted-foreground [&_th]:bg-[inherit]">{header}</thead>
          <tbody>
            {loading ? (
              Array.from({ length: 12 }, (_, i) => (
                <tr key={i} aria-hidden="true">
                  <td colSpan={3} className="h-6 px-3">
                    <span className="sr-only">Loading</span>
                    <div className="h-2.5 animate-pulse rounded-sm bg-container-high" style={{ width: `${40 + ((i * 37) % 50)}%` }} />
                  </td>
                </tr>
              ))
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-3 py-10 text-center font-sans text-muted-foreground">
                  {emptyState ?? (tab === "mine" ? "No trades yet." : "No trades.")}
                </td>
              </tr>
            ) : (
              rows.map((t) => {
                const color = TONE_TEXT[sideTone(t.side)];
                const flash = !baseline.ids.has(t.id);
                const label = (
                  <>
                    <span className="sr-only">{t.side === "buy" ? "Buy " : "Sell "}</span>
                    {formatPrice(t.price)}
                  </>
                );
                return (
                  <tr
                    key={t.id}
                    style={flash ? ({ "--trade-flash": t.side === "buy" ? "rgb(16 185 129 / 0.2)" : "rgb(244 63 94 / 0.2)" } as CSSProperties) : undefined}
                    className={cn(
                      "relative h-6",
                      flash && "animate-[dx-trade-flash_0.9s_ease-out] motion-reduce:animate-none",
                      onTradeClick && "hover:bg-container-high",
                    )}
                  >
                    <td className={cn("pl-3", color)}>
                      {onTradeClick ? (
                        <button
                          type="button"
                          onClick={() => onTradeClick(t)}
                          className="focus-ring rounded-xs text-left after:absolute after:inset-0 after:content-['']"
                        >
                          {label}
                        </button>
                      ) : (
                        label
                      )}
                    </td>
                    <td className="text-right text-foreground/90">{formatSize(t.size)}</td>
                    <td className="pr-3 text-right text-muted-foreground">{formatTime(t.time)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
