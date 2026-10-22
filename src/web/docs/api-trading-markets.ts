import type { ApiDoc } from "./api";

/** Trading kit API docs — markets. */
export const tradingApiMarkets: Record<string, ApiDoc> = {
  "markets-list": {
    usage: `import { DEFAULT_MARKETS_TABS, MarketsList } from "@/components/trading/markets-list"

<MarketsList
  markets={markets}
  tabs={DEFAULT_MARKETS_TABS}
  favorites={favorites}
  onFavoriteChange={(symbol, on) => toggleFavorite(symbol, on)}
  activeSymbol={symbol}
  onSymbolSelect={(market) => setSymbol(market.symbol)}
  className="h-[520px]"
/>`,
    notes:
      "Markets come in as props; search, sort, tab and sub-tab are local UI state, with `value` / `defaultValue` / `on…Change` pairs for search, sort and tab. Tabs are plain objects with a `filter(market, { favorites })` predicate and optional `subTabs` — use them for RWA sessions, community brokers or favourite groups. `layout=\"side\"` is the dense two-line sidebar list; `layout=\"table\"` is the full markets page and hides volume, OI and funding columns on narrow screens. Rows are real buttons; favourite stars and the favourites-tab pin action stop propagation. `sortMarkets` and `matchesSearch` are exported if you need the same ordering elsewhere.",
    align: "start",
    exampleTitles: { table: "Table layout" },
    props: [
      {
        component: "MarketsList",
        rows: [
          ["markets", "Market[]", undefined, "symbol, price, change, volume24h, openInterest, fundingRate, maxLeverage, tick, badge, listedAt, tags."],
          ["favorites", "string[]", undefined, "Favourite symbols in display order. Omit to hide stars."],
          ["onFavoriteChange", "(symbol, favorite) => void"],
          ["onPinToTop", "(symbol) => void", undefined, "Adds a move-to-top action on the favourites tab."],
          ["activeSymbol", "string", undefined, "Highlighted row."],
          ["onSymbolSelect", "(market: Market) => void"],
          ["tabs", "MarketsTab[] | false", "DEFAULT_MARKETS_TABS", "Favourites / All / New / RWA."],
          ["tab / defaultTab / onTabChange", "string"],
          ["search / defaultSearch / onSearchChange", "string"],
          ["sort / defaultSort / onSortChange", "{ key, direction } | null", "volume desc", "Header clicks cycle desc → asc → off."],
          ["layout", '"side" | "table"', '"side"'],
          ["columns", "MarketsColumn[]", "all", "Table layout: price, change, volume24h, openInterest, fundingRate."],
          ["fundingLabel", "ReactNode", '"Funding"'],
          ["lowVolumeThreshold", "number", undefined, "Hides markets below this 24h volume behind a checkbox."],
          ["showSearch", "boolean", "true"],
          ["autoFocusSearch", "boolean", "false"],
          ["toolbar", "ReactNode", undefined, "After the search field."],
          ["loading", "boolean", "false", "Skeleton rows."],
          ["emptyState", "ReactNode"],
          ["bodyClassName", "string", undefined, "The scrolling body — set a max height here or size the root."],
        ],
      },
      {
        component: "MarketsTab",
        rows: [
          ["value", "string"],
          ["label", "ReactNode"],
          ["ariaLabel", "string", undefined, "For icon labels."],
          ["filter", "(market, { favorites }) => boolean"],
          ["subTabs", "{ value, label, filter? }[]", undefined, "A second row of chips."],
          ["defaultSort", "MarketsSort", undefined, "Applied when the tab opens (uncontrolled sort)."],
          ["isFavorites", "boolean", undefined, "Follow the favourites order and show pin actions."],
          ["empty", "ReactNode"],
        ],
      },
    ],
  },
  "market-selector": {
    usage: `import { MarketSelector } from "@/components/trading/market-selector"

<MarketSelector
  symbol={symbol}
  badge="50x"
  markets={markets}
  favorites={favorites}
  onFavoriteChange={toggleFavorite}
  onSymbolSelect={(market) => setSymbol(market.symbol)}
/>`,
    notes:
      "Wraps `MarketsList` — every list prop passes through. On desktop it opens a popover with the search focused; under 768px it opens a left sheet (`mode` forces either). It closes after a pick unless `closeOnSelect={false}`.",
    props: [
      {
        component: "MarketSelector",
        rows: [
          ["symbol", "string", undefined, "Shown on the trigger and highlighted in the list."],
          ["iconSrc", "string"],
          ["badge", "ReactNode", undefined, "E.g. max leverage."],
          ["trigger", "ReactNode", undefined, "Replaces the trigger content."],
          ["open / defaultOpen / onOpenChange", "boolean"],
          ["mode", '"auto" | "popover" | "sheet"', '"auto"'],
          ["closeOnSelect", "boolean", "true"],
          ["title", "ReactNode", '"Markets"', "Sheet heading."],
          ["…MarketsListProps", "", undefined, "markets, favorites, tabs, sort, layout…"],
          ["contentClassName", "string"],
        ],
      },
    ],
  },
  "markets-ticker": {
    usage: `import { MarketsTicker } from "@/components/trading/markets-ticker"

<MarketsTicker markets={tickers} activeSymbol={symbol} onSymbolClick={setSymbol} />`,
    notes:
      "Scrolls continuously and pauses on hover or focus; with `autoScroll={false}` or reduced motion it becomes a plain horizontal scroller. The filter popover picks one market type; types are `{ value, label, filter }` objects, and the defaults match on `tags` (`crypto`, `new`, `rwa`).",
    props: [
      {
        component: "MarketsTicker",
        rows: [
          ["markets", "TickerMarket[]", undefined, "symbol, price, change, tick, iconSrc, tags."],
          ["activeSymbol", "string"],
          ["onSymbolClick", "(symbol: string) => void"],
          ["types", "TickerType[] | false", "DEFAULT_TICKER_TYPES"],
          ["type / defaultType / onTypeChange", "string"],
          ["autoScroll", "boolean", "true"],
          ["speed", "number", "40", "Pixels per second."],
          ["filterSide", '"top" | "bottom"', '"bottom"'],
        ],
      },
      { component: "MarketChip", rows: [["market", "TickerMarket"], ["active", "boolean"], ["onClick", "(symbol) => void"]] },
    ],
  },
  "markets-overview": {
    usage: `import { MarketsOverview } from "@/components/trading/markets-overview"

<MarketsOverview
  markets={markets}
  totalVolume24h={stats.volume}
  totalOpenInterest={stats.oi}
  tvl={stats.tvl}
  onSymbolSelect={setSymbol}
/>`,
    notes:
      "Cards are derived from `markets` (sorted by change, volume and `listedAt`) unless you pass `gainers`, `losers`, `newListings` or `volumeLeaders` yourself. `variant=\"auto\"` shows the card grid from `md` up and a single tabbed card on phones.",
    align: "start",
    props: [
      {
        component: "MarketsOverview",
        rows: [
          ["markets", "OverviewMarket[]", "[]"],
          ["gainers / losers / newListings / volumeLeaders", "OverviewMarket[]", undefined, "Override the derived lists."],
          ["limit", "number", "5", "Rows per card."],
          ["cards", "OverviewCardKey[]", "all four", '"newListings" | "gainers" | "losers" | "volume".'],
          ["totalVolume24h / totalOpenInterest / tvl", "number | null", undefined, "Stat blocks; omitted ones are hidden."],
          ["stats", "{ label, value }[]", "[]"],
          ["onSymbolSelect", "(symbol: string) => void"],
          ["variant", '"auto" | "grid" | "tabs"', '"auto"'],
          ["loading", "boolean", "false"],
        ],
      },
    ],
  },
  "funding-rate": {
    usage: `import { FundingRate } from "@/components/trading/funding-rate"

<FundingRate
  rate={funding.predicted}
  nextFundingTime={funding.nextAt}
  intervalHours={8}
  lastRate={funding.last}
  capRate={0.0075}
  floorRate={-0.0075}
  positionSize={position.qty}
  markPrice={mark}
/>`,
    notes:
      "Rates are fractions per interval. The details scale the predicted rate to other horizons and annualise it (simple, not compounded); the estimated payment is `−rate × size × mark`, so longs pay positive rates. The countdown re-renders once a second and does nothing else. `FundingRateDetails`, `scaleFundingRate` and `annualizeFundingRate` are exported.",
    exampleTitles: { stacked: "Stacked with dialog (mobile)" },
    props: [
      {
        component: "FundingRate",
        rows: [
          ["rate", "number | null", undefined, "Predicted rate for the current interval."],
          ["nextFundingTime", "number | Date | null"],
          ["intervalHours", "number", "8"],
          ["lastRate", "number | null"],
          ["capRate / floorRate", "number | null"],
          ["positionSize", "number | null", undefined, "Signed base size: + long, − short."],
          ["markPrice", "number | null"],
          ["positionNotional", "number | null", undefined, "Wins over size × mark."],
          ["quote", "string", '"USDC"'],
          ["timeframes", "{ label, hours }[]", "1H … 30D"],
          ["label", "ReactNode", '"Funding / countdown"'],
          ["variant", '"inline" | "stacked"', '"inline"'],
          ["detail", '"popover" | "dialog" | "none"', '"popover"'],
          ["description", "ReactNode", undefined, "Explanation under the details."],
        ],
      },
    ],
  },
  "funding-comparison": {
    usage: `import { FundingComparison } from "@/components/trading/funding-comparison"

<FundingComparison
  rows={rows}
  venues={[
    { id: "dx", label: "DX", intervalHours: 8 },
    { id: "binance", label: "Binance", intervalHours: 8 },
    { id: "hyperliquid", label: "Hyperliquid", intervalHours: 1 },
  ]}
  homeVenue="dx"
/>`,
    notes:
      "Each rate is a fraction per that venue's settlement interval (per-symbol overrides via `row.intervals`). The period toggle only converts for display — rate ÷ interval × 1h, 8h or a year. With a `homeVenue`, spread columns (`home − venue`) follow each venue and an Overview tab shows the home venue's last rate, period averages and share of positive intervals. Search and sorting are local UI state; the first column stays pinned while the table scrolls sideways.",
    align: "start",
    props: [
      {
        component: "FundingComparison",
        rows: [
          ["rows", "FundingComparisonRow[]", undefined, "symbol, openInterest, rates, intervals, lastRate, averages, positiveShare."],
          ["venues", "{ id, label, iconSrc?, intervalHours? }[]"],
          ["homeVenue", "string", undefined, "Your venue's id."],
          ["showSpread", "boolean", "true"],
          ["showOpenInterest", "boolean", "true"],
          ["period / defaultPeriod / onPeriodChange", '"1h" | "8h" | "1y"', '"8h"'],
          ["periods", "FundingPeriod[]", '["1h", "8h", "1y"]'],
          ["view / defaultView / onViewChange", '"overview" | "comparison"'],
          ["showViewTabs", "boolean", "homeVenue set"],
          ["showSearch", "boolean", "true"],
          ["onSymbolSelect", "(symbol: string) => void"],
        ],
      },
    ],
  },
  "recent-trades": {
    usage: `import { RecentTrades } from "@/components/trading/recent-trades"

<RecentTrades
  trades={trades}
  myTrades={fills}
  base="BTC"
  quote="USDC"
  tick={0.1}
  className="h-96"
/>`,
    notes:
      "Pass the latest trades first. Prices are coloured by aggressor side; rows that arrive after mount flash once (skipped under reduced motion). Passing `myTrades` adds a My trades tab. Format functions are props with `lib/trading` defaults.",
    props: [
      {
        component: "RecentTrades",
        rows: [
          ["trades", "{ id, price, size, time, side }[]", undefined, "Latest first; `side` is the aggressor."],
          ["myTrades", "Trade[]", undefined, "Adds a My trades tab."],
          ["tab / defaultTab / onTabChange", '"market" | "mine"', '"market"'],
          ["base / quote", "string", undefined, "Header units."],
          ["tick", "number", undefined, "Price increment."],
          ["sizeDp", "number", "4"],
          ["limit", "number", "40", "Rows rendered."],
          ["formatPrice / formatSize / formatTime", "(value: number) => string"],
          ["onTradeClick", "(trade: Trade) => void", undefined, "Makes rows clickable, e.g. to fill a price."],
          ["loading", "boolean", "false"],
          ["emptyState", "ReactNode"],
        ],
      },
    ],
  },
  "chart-panel": {
    usage: `import { Candles, ChartPanel } from "@/components/trading/chart-panel"

<ChartPanel
  interval={interval}
  onIntervalChange={setInterval}
  chartType={type}
  onChartTypeChange={setType}
  onIndicatorsClick={openIndicators}
  className="h-[440px]"
>
  {/* your TradingView / lightweight-charts widget, or: */}
  <Candles data={ohlc} type={type} tick={0.1} />
</ChartPanel>`,
    notes:
      "The panel is only a frame: it owns the toolbar state and hands it back through callbacks so you can drive your charting library. Interval values are opaque strings. Uncontrolled fullscreen pins the panel `fixed inset-0` and Esc exits. `Candles` (alias `CandlestickSeries`) is a static SVG renderer for an OHLC array — candles, hollow candles, line or area, volume bars, price axis and a pointer OHLC legend — handy for previews and blocks when no chart library is loaded.",
    align: "start",
    props: [
      {
        component: "ChartPanel",
        rows: [
          ["children", "ReactNode", undefined, "Your chart. A placeholder renders when empty."],
          ["interval / defaultInterval / onIntervalChange", "string", '"15m"'],
          ["intervals", "{ value, label }[]", "1m … 1W"],
          ["moreIntervals", "{ value, label }[]", "3m … 1M", "In a dropdown. `[]` hides it."],
          ["chartType / defaultChartType / onChartTypeChange", '"candles" | "hollow" | "line" | "area"'],
          ["chartTypes", "ChartType[]", '["candles", "line"]'],
          ["onIndicatorsClick", "() => void", undefined, "Shows the indicators button."],
          ["onSettingsClick", "() => void", undefined, "Shows the settings button."],
          ["displayOptions", "{ id, label }[]", undefined, "Checkbox menu of chart overlays."],
          ["display / defaultDisplay / onDisplayChange", "Record<string, boolean>"],
          ["fullscreen / defaultFullscreen / onFullscreenChange", "boolean", "false"],
          ["hideFullscreen", "boolean", "false"],
          ["toolbarEnd", "ReactNode"],
          ["placeholder", "ReactNode"],
        ],
      },
      {
        component: "Candles",
        rows: [
          ["data", "{ time, open, high, low, close, volume? }[]", undefined, "Oldest first."],
          ["type", '"candles" | "hollow" | "line" | "area"', '"candles"'],
          ["showVolume / showAxis / showTime / showLastPrice / showLegend", "boolean", "true"],
          ["tick", "number"],
          ["formatPrice / formatTime", "(value: number) => string"],
          ["label", "string", '"Price chart"', "Accessible summary."],
        ],
      },
    ],
  },
  "orderbook-trades": {
    usage: `import { OrderBookTrades } from "@/components/trading/orderbook-trades"

<OrderBookTrades
  bids={book.bids}
  asks={book.asks}
  trades={trades}
  lastPrice={last}
  base="BTC"
  quote="USDC"
  tick={0.1}
  className="h-[520px]"
/>`,
    notes:
      "Composes the Order Book chart and Recent Trades — snapshots pass straight through. `layout=\"tabs\"` is the narrow-column view; `layout=\"columns\"` puts them side by side (stacked on phones). Fine-tune either child with `orderBookProps` and `tradesProps`.",
    exampleTitles: { columns: "Side by side" },
    props: [
      {
        component: "OrderBookTrades",
        rows: [
          ["bids / asks", "{ price, size }[]"],
          ["trades", "Trade[]", undefined, "Latest first."],
          ["myTrades", "Trade[]"],
          ["levels", "number", "10", "Per side."],
          ["lastPrice", "number"],
          ["base / quote", "string"],
          ["tick", "number", undefined, "Formats book and tape prices."],
          ["sizeDp", "number", "4"],
          ["layout", '"tabs" | "columns"', '"tabs"'],
          ["tab / defaultTab / onTabChange", '"book" | "trades"', '"book"'],
          ["onTradeClick", "(trade: Trade) => void"],
          ["orderBookProps", "Partial<OrderBookProps>"],
          ["tradesProps", "Partial<RecentTradesProps>"],
          ["toolbarEnd", "ReactNode", undefined, "End of the tab row."],
        ],
      },
    ],
  },
};
