import { ArrowDownIcon, SearchIcon, XIcon } from "lucide-react";
import { useId, useMemo, useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { Button } from "@/components/ui/button";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { shortenAddress } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type LeaderboardMetric = "volume" | "pnl" | "roi";
export type LeaderboardColumn = LeaderboardMetric | "rewards";

export type LeaderboardEntry = {
  /** Wallet address — shortened for display. */
  address: string;
  /** 1-based rank for the active metric and period. */
  rank: number;
  /** Optional display name shown above the address. */
  name?: string;
  /** Trading volume in quote currency. */
  volume?: number | null;
  /** Realized PnL in quote currency. */
  pnl?: number | null;
  /** Return on investment as a fraction (0.42 = +42%). */
  roi?: number | null;
  /** Estimated rewards for this rank. */
  rewards?: { amount: number; currency: string } | null;
};

export type LeaderboardPeriod = { value: string; label: ReactNode };

export const DEFAULT_LEADERBOARD_PERIODS: LeaderboardPeriod[] = [
  { value: "24h", label: "24H" },
  { value: "7d", label: "7D" },
  { value: "30d", label: "30D" },
  { value: "all", label: "All time" },
];

const METRIC_LABEL: Record<LeaderboardColumn, string> = {
  volume: "Volume",
  pnl: "PnL",
  roi: "ROI",
  rewards: "Est. rewards",
};

/* ------------------------------------------------------------ helpers */

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = (next: T) => {
    if (!controlled) setInner(next);
    onChange?.(next);
  };
  return [current, set] as const;
}

const PODIUM_ROW: Record<number, string> = {
  1: "bg-linear-to-r from-amber-400/22 via-amber-400/6 to-transparent",
  2: "bg-linear-to-r from-zinc-400/25 via-zinc-400/6 to-transparent",
  3: "bg-linear-to-r from-orange-700/22 via-orange-700/6 to-transparent",
};

const MEDAL_STOPS: Record<1 | 2 | 3, [number, string][]> = {
  1: [
    [0, "#8C421D"],
    [0.33, "#FBE67B"],
    [0.54, "#FCFBE7"],
    [0.77, "#F7D14E"],
    [1, "#D4A041"],
  ],
  2: [
    [0, "#7F7F7F"],
    [0.33, "#D9D9D9"],
    [0.54, "#F7F6F4"],
    [0.77, "#D9D9D9"],
    [1, "#7F7F7F"],
  ],
  3: [
    [0, "#B6947E"],
    [0.2, "#8F6959"],
    [0.48, "#F8DAC8"],
    [0.67, "#AC836E"],
    [0.83, "#B6947E"],
    [1, "#F8DCCB"],
  ],
};

const MEDAL_RIBBON =
  "M3.88 2.5 7.79 10.31A6.98 6.98 0 0 0 5.5 15.5c0 3.9 3.1 7 7 7s7-3.1 7-7a6.98 6.98 0 0 0-2.29-5.19L21.12 2.5H15.5l-3 6-3-6zM12.5 10.5c2.8 0 5 2.2 5 5s-2.2 5-5 5-5-2.2-5-5 2.2-5 5-5";

/** Rank number — a gold, silver or bronze medal for the podium. */
export function RankBadge({ rank, className }: { rank: number; className?: string }) {
  const id = useId();
  if (rank >= 1 && rank <= 3) {
    const stops = MEDAL_STOPS[rank as 1 | 2 | 3];
    return (
      <span className={cn("relative inline-grid size-6 shrink-0 place-items-center", className)}>
        <svg viewBox="0 0 25 25" className="size-6" aria-hidden="true">
          <defs>
            <linearGradient id={id} x1="6" y1="6" x2="20" y2="18" gradientUnits="userSpaceOnUse">
              {stops.map(([offset, color]) => (
                <stop key={offset} offset={offset} stopColor={color} />
              ))}
            </linearGradient>
          </defs>
          <path d={MEDAL_RIBBON} fill={`url(#${id})`} fillRule="evenodd" />
          <text x="12.5" y="18.4" textAnchor="middle" fontSize="7" fontWeight="700" fill={`url(#${id})`}>
            {rank}
          </text>
        </svg>
        <span className="sr-only">Rank {rank}</span>
      </span>
    );
  }
  return (
    <span className={cn("inline-block min-w-6 text-center font-mono text-xs text-muted-foreground tabular-nums", className)}>
      {rank > 0 ? rank : "—"}
    </span>
  );
}

function MetricValue({ column, entry }: { column: LeaderboardColumn; entry: LeaderboardEntry }) {
  switch (column) {
    case "volume":
      return <Numeral value={entry.volume} rule="usd" />;
    case "pnl":
      return <Numeral value={entry.pnl} rule="usd" coloring showSign />;
    case "roi":
      return <Numeral value={entry.roi} rule="percent" coloring showSign />;
    case "rewards":
      return entry.rewards ? <Numeral value={entry.rewards.amount} dp={0} unit={entry.rewards.currency} /> : <span className="text-muted-foreground">—</span>;
  }
}

function Trader({
  entry,
  you,
  onAddressClick,
}: {
  entry: LeaderboardEntry;
  you?: boolean;
  onAddressClick?: (entry: LeaderboardEntry) => void;
}) {
  const address = <span className="font-mono text-xs">{shortenAddress(entry.address)}</span>;
  return (
    <span className="flex min-w-0 flex-col items-start gap-0.5">
      {entry.name && <span className="truncate text-sm font-medium">{entry.name}</span>}
      <span className="flex items-center gap-1.5">
        {onAddressClick ? (
          <button
            type="button"
            onClick={() => onAddressClick(entry)}
            title={entry.address}
            className={cn(
              "focus-ring rounded-sm underline decoration-border decoration-dashed underline-offset-4 hover:decoration-foreground",
              entry.name && "text-muted-foreground",
            )}
          >
            {address}
          </button>
        ) : (
          <span title={entry.address} className={cn(entry.name && "text-muted-foreground")}>
            {address}
          </span>
        )}
        {you && (
          <span className="inline-flex h-4 items-center rounded-[5px] bg-primary/12 px-1 text-[10px] leading-none font-medium text-primary">You</span>
        )}
      </span>
    </span>
  );
}

/* ------------------------------------------------------------ component */

export interface LeaderboardProps {
  /** Ranked rows for the active metric and period. Sort them before passing them in. */
  entries: LeaderboardEntry[];
  /** Your own row, pinned to the top and highlighted. Pass `null` when you are unranked. */
  you?: LeaderboardEntry | null;
  /** Highlight rows with this address. Defaults to `you.address`. */
  yourAddress?: string;
  /** Heading shown above the filters. */
  title?: ReactNode;
  /** e.g. "Updated 2 min ago" — shown next to the title. */
  updatedAt?: ReactNode;

  /** Period tabs. Pass `[]` to hide them. */
  periods?: LeaderboardPeriod[];
  period?: string;
  defaultPeriod?: string;
  onPeriodChange?: (period: string) => void;

  /** Metrics the user can rank by. */
  metrics?: LeaderboardMetric[];
  metric?: LeaderboardMetric;
  defaultMetric?: LeaderboardMetric;
  onMetricChange?: (metric: LeaderboardMetric) => void;
  /** Table columns. Defaults to the metrics, plus rewards when any row has them. */
  columns?: LeaderboardColumn[];

  /** Address search text. */
  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  /** Filter `entries` by address and name locally. Turn off when the server filters. */
  filterLocally?: boolean;
  searchPlaceholder?: string;

  /** Show skeleton rows while the first page loads. */
  loading?: boolean;
  /** "Load more" pagination — rendered when `onLoadMore` is set and `hasMore` is true. */
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  /** Paged pagination — rendered instead of "Load more" when `pageCount` is set. 1-based. */
  page?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;

  /** Makes addresses buttons — open an explorer or a trader profile. */
  onAddressClick?: (entry: LeaderboardEntry) => void;
  emptyMessage?: ReactNode;
  className?: string;
}

/** Ranked traders by volume, PnL or ROI — podium styling for the top three, your row pinned. */
export function Leaderboard({
  entries,
  you,
  yourAddress,
  title,
  updatedAt,
  periods = DEFAULT_LEADERBOARD_PERIODS,
  period: periodProp,
  defaultPeriod,
  onPeriodChange,
  metrics = ["volume", "pnl", "roi"],
  metric: metricProp,
  defaultMetric,
  onMetricChange,
  columns: columnsProp,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  filterLocally = true,
  searchPlaceholder = "Search address",
  loading,
  hasMore,
  loadingMore,
  onLoadMore,
  page = 1,
  pageCount,
  onPageChange,
  onAddressClick,
  emptyMessage = "No traders found",
  className,
}: LeaderboardProps) {
  const [period, setPeriod] = useControllable(periodProp, defaultPeriod ?? periods[0]?.value ?? "", onPeriodChange);
  const [metric, setMetric] = useControllable<LeaderboardMetric>(metricProp, defaultMetric ?? metrics[0] ?? "volume", onMetricChange);
  const [search, setSearch] = useControllable(searchProp, defaultSearch, onSearchChange);
  const searchId = useId();

  const columns = useMemo<LeaderboardColumn[]>(
    () => columnsProp ?? [...metrics, ...(entries.some((e) => e.rewards) ? (["rewards"] as const) : [])],
    [columnsProp, metrics, entries],
  );

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!filterLocally || !q) return entries;
    return entries.filter((e) => e.address.toLowerCase().includes(q) || e.name?.toLowerCase().includes(q));
  }, [entries, search, filterLocally]);

  const mine = (yourAddress ?? you?.address)?.toLowerCase();
  const isYou = (e: LeaderboardEntry) => mine != null && e.address.toLowerCase() === mine;
  const secondary = columns.filter((c) => c !== metric);

  const header = (
    <div className="flex flex-col gap-3">
      {(title || updatedAt) && (
        <div className="flex items-baseline justify-between gap-3">
          {title && <h3 className="text-base font-semibold tracking-[-0.01em]">{title}</h3>}
          {updatedAt && <span className="text-[11px] text-muted-foreground">{updatedAt}</span>}
        </div>
      )}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-2">
          {metrics.length > 1 && (
            <Tabs value={metric} onValueChange={(v) => setMetric(v as LeaderboardMetric)}>
              <TabsList aria-label="Rank by">
                {metrics.map((m) => (
                  <TabsTrigger key={m} value={m} className="h-7 px-3 text-xs">
                    {METRIC_LABEL[m]}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
          {periods.length > 0 && (
            <Tabs value={period} onValueChange={(v) => setPeriod(String(v))}>
              <TabsList variant="line" aria-label="Period" className="gap-3 border-b-0">
                {periods.map((p) => (
                  <TabsTrigger key={p.value} value={p.value} className="text-xs group-data-[variant=line]/tabs-list:h-8">
                    {p.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          )}
        </div>
        <InputGroup className="h-8 md:w-60">
          <InputGroupAddon>
            <SearchIcon className="size-3.5" />
          </InputGroupAddon>
          <label htmlFor={searchId} className="sr-only">
            Search by address
          </label>
          <InputGroupInput
            id={searchId}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            autoComplete="off"
            spellCheck={false}
            className="text-xs"
          />
          {search && (
            <InputGroupAddon align="inline-end">
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="focus-ring grid size-5 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground"
              >
                <XIcon className="size-3" />
              </button>
            </InputGroupAddon>
          )}
        </InputGroup>
      </div>
    </div>
  );

  const pinned = you && !search.trim() ? you : null;
  const showSkeleton = loading && rows.length === 0;
  const isEmpty = !loading && rows.length === 0;

  const rowClass = (e: LeaderboardEntry, pin = false) =>
    cn(
      "border-b border-outline-variant/60 last:border-0",
      pin || isYou(e) ? "bg-primary/[0.07] shadow-[inset_2px_0_0_var(--primary)]" : PODIUM_ROW[e.rank],
    );

  const desktopRow = (e: LeaderboardEntry, pin = false) => (
    <tr key={pin ? "you" : `${e.rank}-${e.address}`} className={rowClass(e, pin)} data-you={pin || isYou(e) || undefined}>
      <td className="h-12 w-14 pl-4">
        <RankBadge rank={e.rank} />
      </td>
      <td className="h-12 px-3">
        <Trader entry={e} you={pin || isYou(e)} onAddressClick={onAddressClick} />
      </td>
      {columns.map((c) => (
        <td key={c} className={cn("h-12 px-3 text-right text-sm whitespace-nowrap last:pr-4", c === metric && "font-medium")}>
          <MetricValue column={c} entry={e} />
        </td>
      ))}
    </tr>
  );

  const mobileRow = (e: LeaderboardEntry, pin = false) => (
    <li key={pin ? "you" : `${e.rank}-${e.address}`} className={cn("flex items-center gap-3 rounded-xl px-3 py-2.5", rowClass(e, pin), "border-0")}>
      <RankBadge rank={e.rank} />
      <div className="min-w-0 flex-1">
        <Trader entry={e} you={pin || isYou(e)} onAddressClick={onAddressClick} />
      </div>
      <div className="flex shrink-0 flex-col items-end gap-0.5">
        <span className="text-sm font-medium">
          <MetricValue column={metric} entry={e} />
        </span>
        {secondary[0] && (
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            {METRIC_LABEL[secondary[0]]}
            <MetricValue column={secondary[0]} entry={e} />
          </span>
        )}
      </div>
    </li>
  );

  return (
    <div data-slot="leaderboard" className={cn("flex w-full flex-col gap-3 rounded-2xl bg-container p-3 sm:p-4", className)}>
      {header}

      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-outline-variant bg-background md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-outline-variant">
              <th scope="col" className="h-10 w-14 pl-4 text-left text-[11px] font-medium text-muted-foreground">
                Rank
              </th>
              <th scope="col" className="h-10 px-3 text-left text-[11px] font-medium text-muted-foreground">
                Trader
              </th>
              {columns.map((c) => {
                const sortable = (metrics as LeaderboardColumn[]).includes(c);
                const active = c === metric;
                return (
                  <th
                    key={c}
                    scope="col"
                    aria-sort={active ? "descending" : undefined}
                    className="h-10 px-3 text-right text-[11px] font-medium whitespace-nowrap text-muted-foreground last:pr-4"
                  >
                    {sortable ? (
                      <button
                        type="button"
                        onClick={() => setMetric(c as LeaderboardMetric)}
                        className={cn("focus-ring inline-flex items-center gap-1 rounded-sm hover:text-foreground", active && "text-foreground")}
                      >
                        {METRIC_LABEL[c]}
                        <ArrowDownIcon className={cn("size-3 transition-opacity", active ? "opacity-100" : "opacity-0")} />
                      </button>
                    ) : (
                      METRIC_LABEL[c]
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {pinned && desktopRow(pinned, true)}
            {showSkeleton &&
              Array.from({ length: 6 }, (_, i) => (
                <tr key={`sk-${i}`} className="border-b border-outline-variant/60 last:border-0">
                  <td className="h-12 pl-4">
                    <Skeleton className="size-5 rounded-full" />
                  </td>
                  <td className="h-12 px-3">
                    <Skeleton className="h-3 w-28" />
                  </td>
                  {columns.map((c) => (
                    <td key={c} className="h-12 px-3 last:pr-4">
                      <Skeleton className="ml-auto h-3 w-16" />
                    </td>
                  ))}
                </tr>
              ))}
            {rows.map((e) => desktopRow(e))}
            {isEmpty && (
              <tr>
                <td colSpan={columns.length + 2} className="h-24 text-center text-xs text-muted-foreground">
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <ul className="flex flex-col gap-1 md:hidden" aria-label="Leaderboard">
        {pinned && mobileRow(pinned, true)}
        {showSkeleton &&
          Array.from({ length: 5 }, (_, i) => (
            <li key={`sk-${i}`} className="flex items-center gap-3 px-3 py-3">
              <Skeleton className="size-5 rounded-full" />
              <Skeleton className="h-3 flex-1" />
              <Skeleton className="h-3 w-16" />
            </li>
          ))}
        {rows.map((e) => mobileRow(e))}
        {isEmpty && <li className="py-8 text-center text-xs text-muted-foreground">{emptyMessage}</li>}
      </ul>

      {pageCount != null && pageCount > 1 ? (
        <div className="flex items-center justify-end gap-2 text-xs text-muted-foreground">
          <span className="tabular-nums">
            Page {page} of {pageCount}
          </span>
          <Button size="xs" variant="outline" disabled={page <= 1} onClick={() => onPageChange?.(page - 1)}>
            Previous
          </Button>
          <Button size="xs" variant="outline" disabled={page >= pageCount} onClick={() => onPageChange?.(page + 1)}>
            Next
          </Button>
        </div>
      ) : (
        onLoadMore &&
        hasMore && (
          <Button variant="ghost" size="sm" className="self-center" disabled={loadingMore} onClick={onLoadMore}>
            {loadingMore ? "Loading…" : "Load more"}
          </Button>
        )
      )}
    </div>
  );
}
