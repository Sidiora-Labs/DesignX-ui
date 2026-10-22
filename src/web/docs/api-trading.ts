import type { ApiDoc } from "./api";

/** Trading kit API docs — primitives. */
export const tradingApi: Record<string, ApiDoc> = {
  numeral: {
    usage: `import { Numeral, Statistic } from "@/components/trading/numeral"

<Statistic label="Unrealized PnL">
  <Numeral value={pnl} coloring showSign unit="USDC" hidden={hideBalances} />
</Statistic>`,
    notes: "Formatting helpers live in `lib/trading.ts` (`formatNumber`, `formatPrice`, `formatPercent`, `toneOf`, `parseSymbol`) and are shared by every Trading component. Percent values are fractions: `0.0123` renders as `1.23%`.",
    props: [
      {
        component: "Numeral",
        rows: [
          ["value", "number | null | undefined", undefined, "Missing or non-finite values render the placeholder."],
          ["rule", '"price" | "number" | "percent" | "compact" | "usd"', '"number"'],
          ["dp", "number", undefined, "Decimal places. Wins over tick."],
          ["tick", "number", undefined, "Price increment — 0.01 means two decimals."],
          ["coloring", "boolean", "false", "Green for positive, red for negative."],
          ["showSign", "boolean", "false", "Prefix positives with +."],
          ["pad", "boolean", "true", "Keep trailing zeros."],
          ["prefix", "ReactNode"],
          ["unit", "ReactNode", undefined, "Muted suffix such as a currency."],
          ["placeholder", "ReactNode", '"—"'],
          ["hidden", "boolean", "false", "Mask the value."],
          ["mask", "ReactNode", '"*****"'],
        ],
      },
      {
        component: "Statistic",
        rows: [
          ["label", "ReactNode"],
          ["children", "ReactNode"],
          ["align", '"start" | "end"', '"start"'],
        ],
      },
    ],
  },
  "token-icon": {
    usage: `import { ChainIcon, SymbolDisplay, TokenIcon } from "@/components/trading/token-icon"

<TokenIcon symbol="BTC" src={logoUrl} size="md" />
<SymbolDisplay symbol="PERP_BTC_USDC" badge="50x" />`,
    notes: "Symbols are parsed by `parseSymbol` and accept `PERP_BTC_USDC`, `BTC-PERP`, `BTC/USDC` and `BTCUSDT`. Without an image, icons fall back to a lettered disc with a stable colour per ticker.",
    props: [
      {
        component: "TokenIcon",
        rows: [
          ["symbol", "string", undefined, "Ticker or full symbol — the base asset is shown."],
          ["src", "string", undefined, "Image URL; falls back on error."],
          ["size", '"2xs" | "xs" | "sm" | "md" | "lg" | "xl"', '"sm"'],
          ["shape", '"circle" | "square"', '"circle"'],
        ],
      },
      {
        component: "SymbolDisplay",
        rows: [
          ["symbol", "string"],
          ["format", '"base" | "base-quote" | "base-type"', '"base-type"'],
          ["showIcon", "boolean", "true"],
          ["iconSrc", "string"],
          ["size", "TokenIconSize", '"xs"'],
          ["badge", "ReactNode", undefined, "Leverage, market type or status."],
        ],
      },
      { component: "ChainIcon", rows: [["name", "string"], ["src", "string"], ["size", "TokenIconSize", '"sm"']] },
    ],
  },
  "symbol-info-bar": {
    usage: `import { SymbolInfoBar } from "@/components/trading/symbol-info-bar"

<SymbolInfoBar
  symbol="PERP_BTC_USDC"
  price={ticker.last}
  change={ticker.change24h}
  markPrice={ticker.mark}
  indexPrice={ticker.index}
  volume24h={ticker.volume}
  openInterest={ticker.oi}
  fundingRate={funding.rate}
  nextFundingTime={funding.nextAt}
  favorite={isFavorite}
  onFavoriteChange={toggleFavorite}
  onSymbolClick={openMarkets}
/>`,
    notes: "Built-in stats render only when their prop is passed — pass `null` to show a dash while loading. Append your own with `stats`. The funding countdown re-renders once a second and does nothing else.",
    align: "start",
    exampleTitles: { compact: "Compact (mobile)" },
    props: [
      {
        component: "SymbolInfoBar",
        rows: [
          ["symbol", "string"],
          ["price", "number | null"],
          ["change", "number | null", undefined, "24h change as a fraction."],
          ["changeAbs", "number | null", undefined, "24h change in quote currency."],
          ["tick", "number", undefined, "Price increment for formatting."],
          ["maxLeverage", "number"],
          ["badge", "ReactNode"],
          ["markPrice / indexPrice", "number | null"],
          ["volume24h / openInterest", "number | null", undefined, "Quote currency."],
          ["fundingRate", "number | null", undefined, "Fraction — 0.0001 = 0.01%."],
          ["nextFundingTime", "number | Date | null"],
          ["stats", "{ label, value, hint? }[]", "[]", "Extra stats after the built-ins."],
          ["favorite", "boolean", undefined, "Omit to hide the star."],
          ["onFavoriteChange", "(favorite: boolean) => void"],
          ["onSymbolClick", "() => void", undefined, "Makes the symbol a button."],
          ["variant", '"full" | "compact"', '"full"'],
          ["trailing", "ReactNode"],
        ],
      },
    ],
  },
};
