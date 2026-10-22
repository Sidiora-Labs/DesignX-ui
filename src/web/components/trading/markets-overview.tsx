import { FlameIcon, SparklesIcon, TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { TokenIcon } from "@/components/trading/token-icon";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseSymbol, TONE_TEXT } from "@/lib/trading";
import { cn } from "@/lib/utils";

export type OverviewMarket = {
  symbol: string;
  iconSrc?: string;
  price: number | null;
  /** 24h change as a fraction. */
  change?: number | null;
  volume24h?: number | null;
  tick?: number;
  /** Listing time — newest first in "New listings". */
  listedAt?: number;
};

export type OverviewCardKey = "newListings" | "gainers" | "losers" | "volume";

export type OverviewStat = { label: ReactNode; value: number | null | undefined };

export interface MarketsOverviewProps {
  /** All markets — the cards are derived from these unless given explicitly below. */
  markets?: readonly OverviewMarket[];
  gainers?: readonly OverviewMarket[];
  losers?: readonly OverviewMarket[];
  newListings?: readonly OverviewMarket[];
  volumeLeaders?: readonly OverviewMarket[];
  /** Rows per card. */
  limit?: number;
  /** Which cards to show, in order. */
  cards?: OverviewCardKey[];
  /** Exchange-wide 24h volume, quote currency. */
  totalVolume24h?: number | null;
  /** Exchange-wide open interest, quote currency. */
  totalOpenInterest?: number | null;
  /** Total value locked, quote currency. */
  tvl?: number | null;
  /** Extra stat blocks after the built-ins. */
  stats?: OverviewStat[];
  onSymbolSelect?: (symbol: string) => void;
  /** `auto` shows a card grid from `md` up and one tabbed card below it. */
  variant?: "auto" | "grid" | "tabs";
  loading?: boolean;
  className?: string;
}

const CARD_META: Record<OverviewCardKey, { title: string; icon: ReactNode; tone: string; metric: "change" | "volume" }> = {
  newListings: { title: "New listings", icon: <SparklesIcon />, tone: "text-primary", metric: "change" },
  gainers: { title: "Top gainers", icon: <TrendingUpIcon />, tone: TONE_TEXT.up, metric: "change" },
  losers: { title: "Top losers", icon: <TrendingDownIcon />, tone: TONE_TEXT.down, metric: "change" },
  volume: { title: "Highest volume", icon: <FlameIcon />, tone: "text-amber-600 dark:text-amber-400", metric: "volume" },
};

const num = (v: number | null | undefined) => (typeof v === "number" && Number.isFinite(v) ? v : null);

function derive(markets: readonly OverviewMarket[], key: OverviewCardKey) {
  switch (key) {
    case "gainers":
      return markets.filter((m) => (num(m.change) ?? 0) > 0).toSorted((a, b) => num(b.change)! - num(a.change)!);
    case "losers":
      return markets.filter((m) => (num(m.change) ?? 0) < 0).toSorted((a, b) => num(a.change)! - num(b.change)!);
    case "volume":
      return markets.filter((m) => num(m.volume24h) != null).toSorted((a, b) => num(b.volume24h)! - num(a.volume24h)!);
    case "newListings":
      return markets.filter((m) => num(m.listedAt) != null).toSorted((a, b) => num(b.listedAt)! - num(a.listedAt)!);
  }
}

function StatBlock({ label, value }: OverviewStat) {
  return (
    <div className="flex min-w-0 flex-col justify-between gap-3 rounded-2xl bg-container p-3 sm:p-5">
      <span className="truncate text-[11px] font-medium text-muted-foreground sm:text-xs">
        {label}
      </span>
      <Numeral value={value} rule="compact" prefix="$" className="text-base leading-none font-semibold tracking-tight sm:text-2xl lg:text-3xl" />
    </div>
  );
}

function MarketRows({
  rows,
  metric,
  onSymbolSelect,
  loading,
  limit,
}: {
  rows: readonly OverviewMarket[];
  metric: "change" | "volume";
  onSymbolSelect?: (symbol: string) => void;
  loading?: boolean;
  limit: number;
}) {
  if (loading)
    return (
      <ul className="flex flex-col">
        {Array.from({ length: limit }, (_, i) => (
          <li key={i} className="flex h-10 items-center gap-2 px-4">
            <Skeleton className="size-5 rounded-full" />
            <Skeleton className="h-3 w-14" />
            <Skeleton className="ml-auto h-3 w-24" />
          </li>
        ))}
      </ul>
    );
  if (rows.length === 0) return <p className="px-4 py-6 text-center text-xs text-muted-foreground">Nothing to show yet.</p>;
  return (
    <ul className="flex flex-col">
      {rows.map((m) => {
        const { base } = parseSymbol(m.symbol);
        return (
          <li key={m.symbol}>
            <button
              type="button"
              onClick={() => onSymbolSelect?.(m.symbol)}
              className="focus-ring grid h-10 w-full grid-cols-[minmax(0,1fr)_auto_4.5rem] items-center gap-x-3 rounded-lg px-4 text-left text-xs transition-colors hover:bg-container-high"
            >
              <span className="flex min-w-0 items-center gap-1.5 font-medium">
                <TokenIcon symbol={base} src={m.iconSrc} size="xs" />
                <span className="truncate">{base}</span>
              </span>
              <Numeral value={m.price} tick={m.tick} prefix="$" className="justify-end font-medium" />
              {metric === "volume" ? (
                <Numeral value={m.volume24h} rule="compact" prefix="$" className="justify-end text-muted-foreground" />
              ) : (
                <Numeral value={m.change} rule="percent" showSign coloring className="justify-end font-medium" />
              )}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/** Exchange-wide stats plus top gainers, losers, new listings and volume leaders. */
export function MarketsOverview({
  markets = [],
  gainers,
  losers,
  newListings,
  volumeLeaders,
  limit = 5,
  cards = ["newListings", "gainers", "losers", "volume"],
  totalVolume24h,
  totalOpenInterest,
  tvl,
  stats = [],
  onSymbolSelect,
  variant = "auto",
  loading,
  className,
}: MarketsOverviewProps) {
  const explicit: Record<OverviewCardKey, readonly OverviewMarket[] | undefined> = {
    gainers,
    losers,
    newListings,
    volume: volumeLeaders,
  };
  const rowsOf = (key: OverviewCardKey) => (explicit[key] ?? derive(markets, key)).slice(0, limit);
  const [tab, setTab] = useState<OverviewCardKey>(cards[0] ?? "gainers");

  const statBlocks: OverviewStat[] = [];
  if (totalVolume24h !== undefined) statBlocks.push({ label: "24h volume", value: totalVolume24h });
  if (totalOpenInterest !== undefined) statBlocks.push({ label: "Open interest", value: totalOpenInterest });
  if (tvl !== undefined) statBlocks.push({ label: "Assets (TVL)", value: tvl });
  statBlocks.push(...stats);

  const grid = (
    <div
      className={cn(
        "grid gap-3",
        variant === "auto" && "hidden md:grid",
        cards.length >= 4 ? "md:grid-cols-2 xl:grid-cols-4" : cards.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2",
      )}
    >
      {cards.map((key) => {
        const meta = CARD_META[key];
        return (
          <section key={key} aria-label={meta.title} className="rounded-2xl bg-container pt-4 pb-2">
            <h3 className={cn("mb-2 flex items-center gap-1.5 px-4 text-sm font-semibold [&_svg]:size-4", meta.tone)}>
              {meta.icon}
              {meta.title}
            </h3>
            <MarketRows rows={rowsOf(key)} metric={meta.metric} onSymbolSelect={onSymbolSelect} loading={loading} limit={limit} />
          </section>
        );
      })}
    </div>
  );

  const tabbed = (
    <div className={cn("rounded-2xl bg-container pt-2 pb-2", variant === "auto" && "md:hidden")}>
      <div className="overflow-x-auto px-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <Tabs value={tab} onValueChange={(v) => setTab(v as OverviewCardKey)} className="gap-0">
          <TabsList variant="line" className="h-9 gap-4 border-b-0">
            {cards.map((key) => (
              <TabsTrigger key={key} value={key} className="h-9! text-xs">
                {CARD_META[key].title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      <MarketRows rows={rowsOf(tab)} metric={CARD_META[tab].metric} onSymbolSelect={onSymbolSelect} loading={loading} limit={limit} />
    </div>
  );

  return (
    <div data-slot="markets-overview" className={cn("flex w-full flex-col gap-3", className)}>
      {statBlocks.length > 0 && (
        <div className={cn("grid gap-2 sm:gap-3", statBlocks.length >= 3 ? "grid-cols-3" : "grid-cols-2")}>
          {statBlocks.map((s, i) => (
            <StatBlock key={i} {...s} />
          ))}
        </div>
      )}
      {variant !== "tabs" && grid}
      {variant !== "grid" && tabbed}
    </div>
  );
}
