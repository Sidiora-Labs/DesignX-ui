import { ArrowDownIcon, ArrowUpIcon, SearchIcon } from "lucide-react";
import { useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { ChainIcon, SymbolBadge, TokenIcon } from "@/components/trading/token-icon";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { parseSymbol } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type FundingVenue = {
  id: string;
  label: string;
  iconSrc?: string;
  /** Settlement interval in hours for this venue. */
  intervalHours?: number;
};

export type FundingAveragePeriod = "1d" | "3d" | "7d" | "14d" | "30d" | "90d";

export type FundingComparisonRow = {
  symbol: string;
  iconSrc?: string;
  maxLeverage?: number;
  /** Open interest in quote currency. */
  openInterest?: number | null;
  /** Rate per venue id — a fraction per that venue's interval. `null` shows a dash. */
  rates: Record<string, number | null | undefined>;
  /** Per-symbol interval overrides, by venue id. */
  intervals?: Record<string, number>;
  /** Last settled rate on the home venue (overview). */
  lastRate?: number | null;
  /** Average rate over each period on the home venue (overview). */
  averages?: Partial<Record<FundingAveragePeriod, number | null>>;
  /** Share of intervals with a positive rate, as a fraction (overview). */
  positiveShare?: Partial<Record<FundingAveragePeriod, number | null>>;
};

export type FundingPeriod = "1h" | "8h" | "1y";

const PERIOD_HOURS: Record<FundingPeriod, number> = { "1h": 1, "8h": 8, "1y": 24 * 365 };
const PERIOD_LABEL: Record<FundingPeriod, string> = { "1h": "1h", "8h": "8h", "1y": "Annualised" };
const AVERAGES: FundingAveragePeriod[] = ["1d", "3d", "7d", "14d", "30d", "90d"];

/** Convert a per-interval rate to the chosen display period — display arithmetic only. */
export function convertFundingRate(rate: number | null | undefined, intervalHours: number, period: FundingPeriod) {
  if (rate == null || !Number.isFinite(rate) || intervalHours <= 0) return null;
  return (rate / intervalHours) * PERIOD_HOURS[period];
}

const intervalOf = (row: FundingComparisonRow, venue: FundingVenue | undefined) =>
  (venue && row.intervals?.[venue.id]) ?? venue?.intervalHours ?? 8;

/* ------------------------------------------------------------ component */

export interface FundingComparisonProps {
  rows: readonly FundingComparisonRow[];
  /** Venues to compare, in column order. */
  venues: readonly FundingVenue[];
  /** Your venue's id — gets spread columns against every other venue and drives the overview. */
  homeVenue?: string;
  /** Show `home − venue` spread columns. */
  showSpread?: boolean;
  showOpenInterest?: boolean;
  /** Display period: rates are converted from each venue's interval. */
  period?: FundingPeriod;
  defaultPeriod?: FundingPeriod;
  onPeriodChange?: (period: FundingPeriod) => void;
  periods?: FundingPeriod[];
  /** `overview` shows the home venue's history; `comparison` the venue matrix. */
  view?: "overview" | "comparison";
  defaultView?: "overview" | "comparison";
  onViewChange?: (view: "overview" | "comparison") => void;
  /** Hide the Overview / Comparison tabs. Defaults to showing them when a home venue is set. */
  showViewTabs?: boolean;
  showSearch?: boolean;
  onSymbolSelect?: (symbol: string) => void;
  emptyState?: ReactNode;
  className?: string;
}

type SortState = { key: string; direction: "asc" | "desc" } | null;

function SortButton({ label, active, onClick, align = "end" }: { label: ReactNode; active: "asc" | "desc" | null; onClick: () => void; align?: "start" | "end" }) {
  const Icon = active === "asc" ? ArrowUpIcon : ArrowDownIcon;
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "focus-ring inline-flex items-center gap-1 rounded-sm whitespace-nowrap hover:text-foreground",
        active && "text-foreground",
        align === "end" && "flex-row-reverse",
      )}
    >
      <Icon aria-hidden="true" className={cn("size-3 shrink-0", active ? "opacity-100" : "opacity-0")} />
      {label}
    </button>
  );
}

/** Funding rates per market compared across venues, with an overview of your venue's history. */
export function FundingComparison({
  rows,
  venues,
  homeVenue,
  showSpread = true,
  showOpenInterest = true,
  period: periodProp,
  defaultPeriod = "8h",
  onPeriodChange,
  periods = ["1h", "8h", "1y"],
  view: viewProp,
  defaultView,
  onViewChange,
  showViewTabs,
  showSearch = true,
  onSymbolSelect,
  emptyState = "No markets.",
  className,
}: FundingComparisonProps) {
  const [innerPeriod, setInnerPeriod] = useState(defaultPeriod);
  const period = periodProp ?? innerPeriod;
  const setPeriod = (p: FundingPeriod) => {
    if (periodProp === undefined) setInnerPeriod(p);
    onPeriodChange?.(p);
  };
  const tabsVisible = showViewTabs ?? homeVenue != null;
  const [innerView, setInnerView] = useState(defaultView ?? (tabsVisible ? "overview" : "comparison"));
  const view = viewProp ?? innerView;
  const setView = (v: "overview" | "comparison") => {
    if (viewProp === undefined) setInnerView(v);
    onViewChange?.(v);
  };
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortState>({ key: "openInterest", direction: "desc" });
  const [positivePeriod, setPositivePeriod] = useState<FundingAveragePeriod>("7d");

  const home = venues.find((v) => v.id === homeVenue);
  const others = venues.filter((v) => v.id !== homeVenue);
  const rateOf = (row: FundingComparisonRow, venue: FundingVenue) => convertFundingRate(row.rates[venue.id], intervalOf(row, venue), period);
  const spreadOf = (row: FundingComparisonRow, venue: FundingVenue) => {
    if (!home) return null;
    const a = rateOf(row, home);
    const b = rateOf(row, venue);
    return a == null || b == null ? null : a - b;
  };
  const homeConvert = (row: FundingComparisonRow, v: number | null | undefined) => convertFundingRate(v, intervalOf(row, home), period);

  type Col = { key: string; label: ReactNode; value: (row: FundingComparisonRow) => number | null | undefined; kind: "rate" | "usd" | "share"; colored?: boolean; className?: string };

  const columns: Col[] = [];
  if (showOpenInterest) columns.push({ key: "openInterest", label: "Open interest", value: (r) => r.openInterest, kind: "usd" });
  if (view === "overview" && home) {
    columns.push({ key: "est", label: "Est. funding", value: (r) => rateOf(r, home), kind: "rate", colored: true });
    columns.push({ key: "last", label: "Last funding", value: (r) => homeConvert(r, r.lastRate), kind: "rate", colored: true });
    for (const p of AVERAGES)
      columns.push({ key: `avg-${p}`, label: `${p.toUpperCase()} avg`, value: (r) => homeConvert(r, r.averages?.[p]), kind: "rate", colored: true });
    columns.push({ key: "positive", label: "Positive rate", value: (r) => r.positiveShare?.[positivePeriod], kind: "share" });
  } else {
    for (const v of home ? [home, ...others] : venues) {
      columns.push({ key: `v-${v.id}`, label: <VenueLabel venue={v} />, value: (r) => rateOf(r, v), kind: "rate", colored: v.id === homeVenue });
      if (home && showSpread && v.id !== home.id)
        columns.push({
          key: `s-${v.id}`,
          label: (
            <span>
              {home.label} − {v.label}
            </span>
          ),
          value: (r) => spreadOf(r, v),
          kind: "rate",
          colored: true,
          className: "bg-container-high/40",
        });
    }
  }

  const visible = (() => {
    const q = search.trim().toUpperCase();
    let list = rows.filter((r) => !q || r.symbol.toUpperCase().includes(q));
    if (sort) {
      const dir = sort.direction === "asc" ? 1 : -1;
      const col = columns.find((c) => c.key === sort.key);
      list = list.toSorted((a, b) => {
        if (sort.key === "symbol") return dir * parseSymbol(a.symbol).base.localeCompare(parseSymbol(b.symbol).base);
        const x = col?.value(a);
        const y = col?.value(b);
        const xv = x != null && Number.isFinite(x);
        const yv = y != null && Number.isFinite(y);
        if (!xv || !yv) return xv === yv ? 0 : xv ? -1 : 1;
        return dir * (x - y);
      });
    }
    return list;
  })();

  const toggleSort = (key: string) =>
    setSort((s) => {
      const first = key === "symbol" ? "asc" : "desc";
      if (!s || s.key !== key) return { key, direction: first };
      if (s.direction === first) return { key, direction: first === "asc" ? "desc" : "asc" };
      return null;
    });
  const activeDir = (key: string) => (sort?.key === key ? sort.direction : null);
  const ariaSort = (key: string) => (sort?.key === key ? (sort.direction === "asc" ? "ascending" : "descending") : undefined);

  return (
    <div data-slot="funding-comparison" className={cn("flex w-full flex-col gap-3", className)}>
      <div className="flex flex-wrap items-center gap-2">
        {tabsVisible && home && (
          <Tabs value={view} onValueChange={(v) => setView(v as "overview" | "comparison")} className="gap-0">
            <TabsList>
              <TabsTrigger value="overview" className="h-7 px-3 text-xs">
                Overview
              </TabsTrigger>
              <TabsTrigger value="comparison" className="h-7 px-3 text-xs">
                Comparison
              </TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <div className="ml-auto flex flex-wrap items-center gap-2">
          {showSearch && (
            <InputGroup className="h-8 w-40 rounded-lg bg-container sm:w-52">
              <InputGroupAddon className="pl-2.5">
                <SearchIcon className="size-3.5" />
              </InputGroupAddon>
              <InputGroupInput
                type="search"
                aria-label="Search markets"
                placeholder="Search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="text-xs"
              />
            </InputGroup>
          )}
          {periods.length > 1 && (
            <ToggleGroup
              aria-label="Funding period"
              size="sm"
              value={[period]}
              onValueChange={(v) => v[0] && setPeriod(v[0] as FundingPeriod)}
              className="p-0.5"
            >
              {periods.map((p) => (
                <ToggleGroupItem key={p} value={p} className="h-7 min-w-0 px-2.5 text-xs">
                  {PERIOD_LABEL[p]}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          )}
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-background">
        <table className="w-full border-separate border-spacing-0 text-xs">
          <caption className="sr-only">
            Funding rates, {PERIOD_LABEL[period]} {view === "overview" ? "overview" : "comparison across venues"}
          </caption>
          <thead className="text-[11px] text-muted-foreground">
            <tr>
              <th
                scope="col"
                aria-sort={ariaSort("symbol")}
                className="sticky left-0 z-[1] h-10 border-b border-border bg-background pr-3 pl-4 text-left font-normal"
              >
                <SortButton label="Market" active={activeDir("symbol")} onClick={() => toggleSort("symbol")} align="start" />
              </th>
              {columns.map((c) => (
                <th key={c.key} scope="col" aria-sort={ariaSort(c.key)} className={cn("h-10 border-b border-border px-3 text-right font-normal", c.className)}>
                  <span className="inline-flex items-center gap-1">
                    <SortButton label={c.label} active={activeDir(c.key)} onClick={() => toggleSort(c.key)} />
                    {c.key === "positive" && (
                      <Select value={positivePeriod} onValueChange={(v) => v && setPositivePeriod(v as FundingAveragePeriod)}>
                        <SelectTrigger aria-label="Positive rate period" className="h-6 min-w-0 gap-1 rounded-md px-1.5 text-[11px]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AVERAGES.map((p) => (
                            <SelectItem key={p} value={p}>
                              {p.toUpperCase()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-10 text-center text-muted-foreground">
                  {emptyState}
                </td>
              </tr>
            ) : (
              visible.map((r) => {
                const { base } = parseSymbol(r.symbol);
                const symbol = (
                  <span className="flex items-center gap-1.5 text-xs font-medium">
                    <TokenIcon symbol={base} src={r.iconSrc} size="xs" />
                    {base}
                    {r.maxLeverage != null && <SymbolBadge className="bg-primary/12 text-primary">{r.maxLeverage}x</SymbolBadge>}
                  </span>
                );
                return (
                  <tr key={r.symbol} className="group/row [&>td]:border-b [&>td]:border-border/60 last:[&>td]:border-0">
                    <th scope="row" className="sticky left-0 z-[1] h-11 bg-background pr-3 pl-4 text-left font-normal group-hover/row:bg-container">
                      {onSymbolSelect ? (
                        <button type="button" onClick={() => onSymbolSelect(r.symbol)} className="focus-ring rounded-sm">
                          {symbol}
                        </button>
                      ) : (
                        symbol
                      )}
                    </th>
                    {columns.map((c) => {
                      const v = c.value(r);
                      return (
                        <td key={c.key} className={cn("h-11 px-3 text-right whitespace-nowrap group-hover/row:bg-container", c.className)}>
                          {c.kind === "usd" ? (
                            <Numeral value={v} rule="compact" prefix="$" />
                          ) : c.kind === "share" ? (
                            <Numeral value={v} rule="percent" dp={1} />
                          ) : (
                            <Numeral value={v} rule="percent" dp={period === "1y" ? 2 : 4} showSign={c.colored} coloring={c.colored} />
                          )}
                        </td>
                      );
                    })}
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

function VenueLabel({ venue }: { venue: FundingVenue }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <ChainIcon name={venue.label} src={venue.iconSrc} size="2xs" />
      {venue.label}
    </span>
  );
}
