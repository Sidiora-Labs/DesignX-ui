import { ArrowDownIcon, ArrowUpIcon, ArrowUpToLineIcon, SearchIcon, StarIcon, XIcon } from "lucide-react";
import { useCallback, useId, useMemo, useState, type ReactNode } from "react";

import { Numeral } from "@/components/trading/numeral";
import { SymbolBadge, TokenIcon } from "@/components/trading/token-icon";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { parseSymbol } from "@/lib/trading";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------ types */

export type Market = {
  /** `PERP_BTC_USDC`, `BTC-PERP`… — also the row key. */
  symbol: string;
  iconSrc?: string;
  /** Last traded price. */
  price: number | null;
  /** 24h change as a fraction (0.0123 = +1.23%). */
  change?: number | null;
  /** 24h volume in quote currency. */
  volume24h?: number | null;
  /** Open interest in quote currency. */
  openInterest?: number | null;
  /** Funding rate per interval as a fraction (0.0001 = 0.01%). */
  fundingRate?: number | null;
  maxLeverage?: number;
  /** Price increment, used to format prices. */
  tick?: number;
  /** Extra badge after the ticker, e.g. `RWA` or `New`. */
  badge?: ReactNode;
  /** Listing time — sort key for new listings. */
  listedAt?: number;
  /** Free-form tags (`crypto`, `rwa`, `new`, `fx`…) for tab filters. */
  tags?: readonly string[];
};

export type MarketsSortKey = "symbol" | "price" | "change" | "volume24h" | "openInterest" | "fundingRate" | "listedAt";
export type MarketsSort = { key: MarketsSortKey; direction: "asc" | "desc" } | null;

export type MarketsFilterContext = { favorites: ReadonlySet<string> };

export type MarketsSubTab = {
  value: string;
  label: ReactNode;
  /** Which markets the sub tab shows. Omit to show everything in the parent tab. */
  filter?: (market: Market) => boolean;
};

export type MarketsTab = {
  value: string;
  label: ReactNode;
  /** Accessible name when `label` is an icon. */
  ariaLabel?: string;
  /** Which markets the tab shows. Omit to show all. */
  filter?: (market: Market, context: MarketsFilterContext) => boolean;
  /** A second row of chips — RWA sessions, community brokers, favourite groups… */
  subTabs?: MarketsSubTab[];
  /** Sort applied when the tab is opened and no sort is controlled. */
  defaultSort?: MarketsSort;
  /** Rendered when the tab has no rows. */
  empty?: ReactNode;
  /** Rows follow the `favorites` order and show pin / remove actions. */
  isFavorites?: boolean;
};

export type MarketsColumn = "price" | "change" | "volume24h" | "openInterest" | "fundingRate";

/* ------------------------------------------------------------ presets */

const hasTag = (m: Market, tag: string) => m.tags?.includes(tag) ?? false;

export const FAVORITES_TAB: MarketsTab = {
  value: "favorites",
  label: <StarIcon className="size-3.5" />,
  ariaLabel: "Favourites",
  isFavorites: true,
  filter: (m, { favorites }) => favorites.has(m.symbol),
};

/** Favourites / All / New / RWA — pass your own array to change them. */
export const DEFAULT_MARKETS_TABS: MarketsTab[] = [
  FAVORITES_TAB,
  { value: "all", label: "All" },
  {
    value: "new",
    label: "New",
    filter: (m) => hasTag(m, "new"),
    defaultSort: { key: "listedAt", direction: "desc" },
  },
  { value: "rwa", label: "RWA", filter: (m) => hasTag(m, "rwa") },
];

/* ------------------------------------------------------------ helpers */

function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (value: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const current = controlled ? value : inner;
  const set = useCallback(
    (next: T) => {
      if (!controlled) setInner(next);
      onChange?.(next);
    },
    [controlled, onChange],
  );
  return [current, set] as const;
}

/** Case-insensitive match on the base asset and the full symbol. */
export function matchesSearch(market: Market, query: string) {
  const q = query.trim().toUpperCase();
  if (!q) return true;
  return parseSymbol(market.symbol).base.includes(q) || market.symbol.toUpperCase().includes(q);
}

/** Stable sort; missing values always sink to the bottom. */
export function sortMarkets(markets: readonly Market[], sort: MarketsSort) {
  if (!sort) return [...markets];
  const dir = sort.direction === "asc" ? 1 : -1;
  return markets.toSorted((a, b) => {
    if (sort.key === "symbol") return dir * parseSymbol(a.symbol).base.localeCompare(parseSymbol(b.symbol).base);
    const x = a[sort.key];
    const y = b[sort.key];
    const xv = typeof x === "number" && Number.isFinite(x);
    const yv = typeof y === "number" && Number.isFinite(y);
    if (!xv || !yv) return xv === yv ? 0 : xv ? -1 : 1;
    return dir * ((x as number) - (y as number));
  });
}

/** desc → asc → off, the way exchange tables cycle. Text columns start ascending. */
function nextSort(current: MarketsSort, key: MarketsSortKey): MarketsSort {
  const first = key === "symbol" ? "asc" : "desc";
  if (!current || current.key !== key) return { key, direction: first };
  if (current.direction === first) return { key, direction: first === "asc" ? "desc" : "asc" };
  return null;
}

/* ------------------------------------------------------------ pieces */

export interface MarketsSearchProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  focusOnMount?: boolean;
  className?: string;
}

/** The search field above a markets list. */
export function MarketsSearch({ value, onValueChange, placeholder = "Search markets", focusOnMount, className }: MarketsSearchProps) {
  return (
    <InputGroup className={cn("h-8 rounded-lg bg-container", className)}>
      <InputGroupAddon className="pl-2.5">
        <SearchIcon className="size-3.5" />
      </InputGroupAddon>
      <InputGroupInput
        type="search"
        aria-label={placeholder}
        placeholder={placeholder}
        value={value}
        // oxlint-disable-next-line jsx-a11y/no-autofocus -- opt-in, used inside popovers
        autoFocus={focusOnMount}
        autoComplete="off"
        spellCheck={false}
        onChange={(e) => onValueChange(e.target.value)}
        className="text-xs [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <InputGroupAddon align="inline-end">
          <button
            type="button"
            aria-label="Clear search"
            onClick={() => onValueChange("")}
            className="focus-ring grid size-5 place-items-center rounded-full text-muted-foreground hover:bg-container-high hover:text-foreground"
          >
            <XIcon className="size-3" />
          </button>
        </InputGroupAddon>
      )}
    </InputGroup>
  );
}

/** A favourite star toggle. */
export function FavoriteStar({
  favorite,
  onChange,
  symbol,
  className,
}: {
  favorite: boolean;
  onChange?: (favorite: boolean) => void;
  symbol: string;
  className?: string;
}) {
  const base = parseSymbol(symbol).base;
  return (
    <button
      type="button"
      aria-label={favorite ? `Remove ${base} from favourites` : `Add ${base} to favourites`}
      aria-pressed={favorite}
      onClick={(e) => {
        e.stopPropagation();
        onChange?.(!favorite);
      }}
      className={cn(
        "focus-ring relative z-[1] grid size-5 shrink-0 place-items-center rounded-full text-muted-foreground/60 hover:text-foreground",
        className,
      )}
    >
      <StarIcon className={cn("size-3 transition-colors", favorite && "fill-amber-400 text-amber-400")} />
    </button>
  );
}

function SortHeader({
  label,
  sortKey,
  sort,
  onSort,
  align = "end",
}: {
  label: ReactNode;
  sortKey: MarketsSortKey;
  sort: MarketsSort;
  onSort: (key: MarketsSortKey) => void;
  align?: "start" | "end";
}) {
  const active = sort?.key === sortKey ? sort.direction : null;
  const Icon = active === "asc" ? ArrowUpIcon : ArrowDownIcon;
  return (
    <button
      type="button"
      onClick={() => onSort(sortKey)}
      className={cn(
        "focus-ring inline-flex items-center gap-0.5 rounded-sm whitespace-nowrap hover:text-foreground",
        active && "text-foreground",
        align === "end" && "flex-row-reverse",
      )}
    >
      <Icon className={cn("size-3 shrink-0 transition-opacity", active ? "opacity-100" : "opacity-0")} aria-hidden="true" />
      {label}
      {active && <span className="sr-only">{active === "asc" ? ", sorted ascending" : ", sorted descending"}</span>}
    </button>
  );
}

const ariaSort = (sort: MarketsSort, key: MarketsSortKey) =>
  sort?.key === key ? (sort.direction === "asc" ? "ascending" : "descending") : undefined;

/* ------------------------------------------------------------ list */

export interface MarketsListProps {
  markets: readonly Market[];
  /** Favourite symbols, in display order. Omit to hide the stars and favourite actions. */
  favorites?: readonly string[];
  onFavoriteChange?: (symbol: string, favorite: boolean) => void;
  /** Shows a "move to top" action on favourites rows. */
  onPinToTop?: (symbol: string) => void;
  /** Highlighted row — the market currently traded. */
  activeSymbol?: string;
  onSymbolSelect?: (market: Market) => void;

  /** Category tabs. `false` hides the tab row. */
  tabs?: MarketsTab[] | false;
  tab?: string;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;

  search?: string;
  defaultSearch?: string;
  onSearchChange?: (search: string) => void;
  showSearch?: boolean;
  searchPlaceholder?: string;
  autoFocusSearch?: boolean;

  sort?: MarketsSort;
  /** Initial sort. Each tab's `defaultSort` wins when switching tabs uncontrolled. */
  defaultSort?: MarketsSort;
  onSortChange?: (sort: MarketsSort) => void;

  /** `side` is the dense two-line list for a trading sidebar; `table` is the full markets page. */
  layout?: "side" | "table";
  /** Table layout columns. */
  columns?: MarketsColumn[];
  /** Label of the funding column, e.g. `8h funding`. */
  fundingLabel?: ReactNode;

  /** Hide markets under this 24h volume behind a "Show low volume" checkbox. */
  lowVolumeThreshold?: number;
  /** Rendered after the search field — close buttons, filters… */
  toolbar?: ReactNode;
  loading?: boolean;
  /** Rendered when nothing matches. Tabs can override with `empty`. */
  emptyState?: ReactNode;
  className?: string;
  /** Classes for the scrolling body — set a max height here or size the root. */
  bodyClassName?: string;
}

const ALL_COLUMNS: MarketsColumn[] = ["price", "change", "volume24h", "openInterest", "fundingRate"];

const COLUMN_META: Record<MarketsColumn, { label: ReactNode; cell: string }> = {
  price: { label: "Last price", cell: "" },
  change: { label: "24h change", cell: "" },
  volume24h: { label: "24h volume", cell: "hidden sm:table-cell" },
  openInterest: { label: "Open interest", cell: "hidden md:table-cell" },
  fundingRate: { label: "Funding", cell: "hidden lg:table-cell" },
};

/** A searchable, sortable markets list with favourites and category tabs. */
export function MarketsList({
  markets,
  favorites,
  onFavoriteChange,
  onPinToTop,
  activeSymbol,
  onSymbolSelect,
  tabs = DEFAULT_MARKETS_TABS,
  tab: tabProp,
  defaultTab,
  onTabChange,
  search: searchProp,
  defaultSearch = "",
  onSearchChange,
  showSearch = true,
  searchPlaceholder,
  autoFocusSearch,
  sort: sortProp,
  defaultSort = { key: "volume24h", direction: "desc" },
  onSortChange,
  layout = "side",
  columns = ALL_COLUMNS,
  fundingLabel = "Funding",
  lowVolumeThreshold,
  toolbar,
  loading,
  emptyState,
  className,
  bodyClassName,
}: MarketsListProps) {
  const tabList = tabs || [];
  const firstTab = tabList.find((t) => !t.isFavorites)?.value ?? tabList[0]?.value ?? "";
  const [tab, setTab] = useControllable(tabProp, defaultTab ?? firstTab, onTabChange);
  const [search, setSearch] = useControllable(searchProp, defaultSearch, onSearchChange);
  const [sort, setSort] = useControllable<MarketsSort>(
    sortProp,
    tabList.find((t) => t.value === (defaultTab ?? firstTab))?.defaultSort ?? defaultSort,
    onSortChange,
  );
  const [subTabs, setSubTabs] = useState<Record<string, string>>({});
  const [showLowVolume, setShowLowVolume] = useState(false);
  const lowVolumeId = useId();

  const activeTab = tabList.find((t) => t.value === tab);
  const subTab = activeTab?.subTabs?.find((s) => s.value === subTabs[activeTab.value]) ?? activeTab?.subTabs?.[0];
  const favoriteSet = useMemo(() => new Set(favorites ?? []), [favorites]);
  const starred = favorites !== undefined;
  const favoritesMode = !!activeTab?.isFavorites;

  const changeTab = (next: string) => {
    setTab(next);
    if (sortProp === undefined) {
      const nextTab = tabList.find((t) => t.value === next);
      if (nextTab?.defaultSort !== undefined) setSort(nextTab.defaultSort);
    }
  };

  const rows = useMemo(() => {
    const context = { favorites: favoriteSet };
    let list = markets.filter(
      (m) =>
        (!activeTab?.filter || activeTab.filter(m, context)) &&
        (!subTab?.filter || subTab.filter(m)) &&
        matchesSearch(m, search) &&
        (lowVolumeThreshold == null || showLowVolume || favoritesMode || (m.volume24h ?? 0) >= lowVolumeThreshold),
    );
    if (favoritesMode && favorites) {
      const order = new Map(favorites.map((s, i) => [s, i]));
      list = list.toSorted((a, b) => (order.get(a.symbol) ?? 0) - (order.get(b.symbol) ?? 0));
    }
    return sortMarkets(list, sort);
  }, [markets, activeTab, subTab, favoriteSet, favorites, favoritesMode, search, sort, lowVolumeThreshold, showLowVolume]);

  const onSort = (key: MarketsSortKey) => setSort(nextSort(sort, key));
  const toggleFavorite = (symbol: string) => (next: boolean) => onFavoriteChange?.(symbol, next);
  const browseAll = () => changeTab(firstTab);

  const empty =
    activeTab?.empty ??
    (favoritesMode && !search ? (
      <div className="flex flex-col items-center gap-2">
        <span>No favourites yet.</span>
        {firstTab !== activeTab?.value && (
          <Button size="xs" variant="outline" onClick={browseAll}>
            Browse markets
          </Button>
        )}
      </div>
    ) : (
      (emptyState ?? (search ? `No markets match “${search.trim()}”.` : "No markets."))
    ));

  const visibleCols = columns.filter((c) => ALL_COLUMNS.includes(c));
  const colCount = layout === "side" ? 3 : visibleCols.length + 1 + (starred ? 1 : 0) + (favoritesMode && onPinToTop ? 1 : 0);
  const dense = layout === "side";

  const pinButton = (symbol: string) =>
    favoritesMode &&
    onPinToTop && (
      <button
        type="button"
        aria-label={`Move ${parseSymbol(symbol).base} to top`}
        onClick={(e) => {
          e.stopPropagation();
          onPinToTop(symbol);
        }}
        className="focus-ring relative z-[1] grid size-6 place-items-center rounded-md text-muted-foreground opacity-0 group-hover/row:opacity-100 group-focus-within/row:opacity-100 hover:bg-container-higher hover:text-foreground focus-visible:opacity-100"
      >
        <ArrowUpToLineIcon className="size-3.5" />
      </button>
    );

  /** The symbol cell's button stretches over the row so the whole row is clickable. */
  const symbolButton = (m: Market, children: ReactNode) => (
    <button
      type="button"
      onClick={() => onSymbolSelect?.(m)}
      aria-current={m.symbol === activeSymbol ? "true" : undefined}
      className="focus-ring flex min-w-0 items-center gap-1.5 rounded-sm text-left after:absolute after:inset-0 after:content-['']"
    >
      {children}
    </button>
  );

  const header = dense ? (
    <tr>
      <th scope="col" className="h-8 pl-3 text-left font-normal" aria-sort={ariaSort(sort, "symbol")}>
        <SortHeader label="Symbol" sortKey="symbol" sort={sort} onSort={onSort} align="start" />
      </th>
      <th scope="col" className="h-8 text-right font-normal" aria-sort={ariaSort(sort, "volume24h") ?? ariaSort(sort, "openInterest")}>
        <span className="inline-flex items-center gap-0.5">
          <SortHeader label="Vol" sortKey="volume24h" sort={sort} onSort={onSort} />
          <span aria-hidden="true">/</span>
          <SortHeader label="OI" sortKey="openInterest" sort={sort} onSort={onSort} />
        </span>
      </th>
      <th scope="col" className="h-8 pr-3 text-right font-normal" aria-sort={ariaSort(sort, "price") ?? ariaSort(sort, "change")}>
        <span className="inline-flex items-center gap-0.5">
          <SortHeader label="Last" sortKey="price" sort={sort} onSort={onSort} />
          <span aria-hidden="true">/</span>
          <SortHeader label="24h%" sortKey="change" sort={sort} onSort={onSort} />
        </span>
      </th>
    </tr>
  ) : (
    <tr>
      {starred && (
        <th scope="col" className="h-10 w-9 pl-3">
          <span className="sr-only">Favourite</span>
        </th>
      )}
      <th scope="col" className={cn("h-10 text-left font-normal", !starred && "pl-4")} aria-sort={ariaSort(sort, "symbol")}>
        <SortHeader label="Market" sortKey="symbol" sort={sort} onSort={onSort} align="start" />
      </th>
      {visibleCols.map((c) => (
        <th key={c} scope="col" className={cn("h-10 px-3 text-right font-normal", COLUMN_META[c].cell)} aria-sort={ariaSort(sort, c)}>
          <SortHeader label={c === "fundingRate" ? fundingLabel : COLUMN_META[c].label} sortKey={c} sort={sort} onSort={onSort} />
        </th>
      ))}
      {favoritesMode && onPinToTop && (
        <th scope="col" className="h-10 w-10 pr-3">
          <span className="sr-only">Actions</span>
        </th>
      )}
    </tr>
  );

  const renderRow = (m: Market) => {
    const { base } = parseSymbol(m.symbol);
    const active = m.symbol === activeSymbol;
    const rowCls = cn(
      "group/row relative transition-colors hover:bg-container-high [&>td]:border-b [&>td]:border-border/60 last:[&>td]:border-0",
      active && "bg-container-high",
    );
    if (dense) {
      return (
        <tr key={m.symbol} className={rowCls}>
          <td className="h-11 pl-3">
            <div className="flex min-w-0 items-center gap-1">
              {starred && <FavoriteStar symbol={m.symbol} favorite={favoriteSet.has(m.symbol)} onChange={toggleFavorite(m.symbol)} />}
              {symbolButton(
                m,
                <>
                  <TokenIcon symbol={base} src={m.iconSrc} size="xs" />
                  <span className="flex min-w-0 flex-col items-start gap-0.5">
                    <span className="truncate text-xs font-medium">{base}</span>
                    {(m.maxLeverage != null || m.badge != null) && (
                      <span className="flex items-center gap-1">
                        {m.maxLeverage != null && <SymbolBadge className="h-3.5 bg-primary/12 text-[9px] text-primary">{m.maxLeverage}x</SymbolBadge>}
                        {m.badge != null && <SymbolBadge className="h-3.5 text-[9px]">{m.badge}</SymbolBadge>}
                      </span>
                    )}
                  </span>
                </>,
              )}
            </div>
          </td>
          <td className="h-11 text-right">
            <div className="flex flex-col items-end gap-0.5">
              <Numeral value={m.volume24h} rule="compact" className="text-xs" />
              <Numeral value={m.openInterest} rule="compact" className="text-[11px] text-muted-foreground" />
            </div>
          </td>
          <td className="h-11 pr-3 text-right">
            <div className="flex items-center justify-end gap-1">
              <div className="flex flex-col items-end gap-0.5">
                <Numeral value={m.price} tick={m.tick} className="text-xs" />
                <Numeral value={m.change} rule="percent" showSign coloring className="text-[11px]" />
              </div>
              {pinButton(m.symbol)}
            </div>
          </td>
        </tr>
      );
    }
    return (
      <tr key={m.symbol} className={rowCls}>
        {starred && (
          <td className="h-13 w-9 pl-3">
            <FavoriteStar symbol={m.symbol} favorite={favoriteSet.has(m.symbol)} onChange={toggleFavorite(m.symbol)} />
          </td>
        )}
        <td className={cn("h-13", !starred && "pl-4")}>
          {symbolButton(
            m,
            <>
              <TokenIcon symbol={base} src={m.iconSrc} size="sm" />
              <span className="truncate text-sm font-medium">{base}</span>
              {m.maxLeverage != null && <SymbolBadge className="bg-primary/12 text-primary">{m.maxLeverage}x</SymbolBadge>}
              {m.badge != null && <SymbolBadge>{m.badge}</SymbolBadge>}
            </>,
          )}
        </td>
        {visibleCols.map((c) => (
          <td key={c} className={cn("h-13 px-3 text-right text-sm", COLUMN_META[c].cell)}>
            {c === "price" && <Numeral value={m.price} tick={m.tick} prefix="$" />}
            {c === "change" && <Numeral value={m.change} rule="percent" showSign coloring />}
            {c === "volume24h" && <Numeral value={m.volume24h} rule="compact" prefix="$" />}
            {c === "openInterest" && <Numeral value={m.openInterest} rule="compact" prefix="$" />}
            {c === "fundingRate" && <Numeral value={m.fundingRate} rule="percent" dp={4} showSign coloring />}
          </td>
        ))}
        {favoritesMode && onPinToTop && <td className="h-13 w-10 pr-3 text-right">{pinButton(m.symbol)}</td>}
      </tr>
    );
  };

  const skeletonRows = Array.from({ length: dense ? 8 : 6 }, (_, i) => (
    <tr key={`s${i}`}>
      <td colSpan={colCount} className={cn("px-3", dense ? "h-11" : "h-13")}>
        <div className="flex items-center gap-2">
          <Skeleton className="size-5 rounded-full" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="ml-auto h-3 w-20" />
        </div>
      </td>
    </tr>
  ));

  return (
    <div data-slot="markets-list" data-layout={layout} className={cn("flex min-h-0 flex-col bg-background", className)}>
      {(showSearch || toolbar || lowVolumeThreshold != null) && (
        <div className={cn("flex shrink-0 items-center gap-2 pb-2", dense ? "px-3 pt-3" : "pt-1")}>
          {showSearch && (
            <MarketsSearch
              value={search}
              onValueChange={setSearch}
              placeholder={searchPlaceholder}
              focusOnMount={autoFocusSearch}
              className={cn("min-w-0 flex-1", !dense && "sm:max-w-64")}
            />
          )}
          {lowVolumeThreshold != null && (
            <div className="flex shrink-0 items-center gap-1.5">
              <Checkbox id={lowVolumeId} checked={showLowVolume} onCheckedChange={(c) => setShowLowVolume(c === true)} className="size-3.5 rounded-[4px] [&_svg]:size-2.5" />
              <label htmlFor={lowVolumeId} className="cursor-pointer text-[11px] whitespace-nowrap text-muted-foreground">
                Low volume
              </label>
            </div>
          )}
          {toolbar}
        </div>
      )}

      {tabList.length > 0 && (
        <div className={cn("shrink-0 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", dense && "px-3")}>
          <Tabs value={tab} onValueChange={(v) => changeTab(String(v))} className="gap-0">
            <TabsList variant="line" className="h-9 gap-4 border-b-0">
              {tabList.map((t) => (
                <TabsTrigger
                  key={t.value}
                  value={t.value}
                  aria-label={t.ariaLabel}
                  className="h-9! text-xs group-data-[variant=line]/tabs-list:h-9 [&_svg]:size-3.5"
                >
                  {t.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      )}

      {activeTab?.subTabs && activeTab.subTabs.length > 0 && (
        <fieldset
          className={cn("m-0 flex min-w-0 shrink-0 gap-1 overflow-x-auto border-0 p-0 pt-2 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden", dense && "px-3")}
        >
          <legend className="sr-only">Subcategory</legend>
          {activeTab.subTabs.map((s) => {
            const on = s.value === subTab?.value;
            return (
              <button
                key={s.value}
                type="button"
                aria-pressed={on}
                onClick={() => setSubTabs((prev) => ({ ...prev, [activeTab.value]: s.value }))}
                className={cn(
                  "focus-ring h-6 shrink-0 rounded-md px-2 text-[11px] font-medium whitespace-nowrap transition-colors",
                  on ? "bg-container-higher text-foreground" : "text-muted-foreground hover:bg-container-high hover:text-foreground",
                )}
              >
                {s.label}
              </button>
            );
          })}
        </fieldset>
      )}

      <div className={cn("min-h-0 flex-1 overflow-auto overscroll-contain bg-inherit", bodyClassName)}>
        <table className="w-full border-separate border-spacing-0 bg-inherit text-xs">
          <caption className="sr-only">Markets</caption>
          <thead className="sticky top-0 z-[2] bg-inherit text-[11px] text-muted-foreground [&_th]:border-b [&_th]:border-border/60 [&_th]:bg-[inherit]">
            {header}
          </thead>
          <tbody>
            {loading ? (
              skeletonRows
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={colCount} className="px-3 py-10 text-center text-xs text-muted-foreground">
                  {empty}
                </td>
              </tr>
            ) : (
              rows.map(renderRow)
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
