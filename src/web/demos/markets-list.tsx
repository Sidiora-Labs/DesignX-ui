import { useState } from "react";

import { FAVORITES_TAB, MarketsList, type Market, type MarketsTab } from "@/components/trading/markets-list";

// Illustrative market snapshot only. Feed these from your market data source.
const DAY = 86_400_000;
const NOW = Date.UTC(2026, 9, 22);
const MARKETS: Market[] = [
  { symbol: "PERP_BTC_USDC", price: 67412.5, change: 0.0234, volume24h: 1_284_000_000, openInterest: 412_600_000, fundingRate: 0.000125, maxLeverage: 50, tick: 0.1, tags: ["crypto"] },
  { symbol: "PERP_ETH_USDC", price: 3184.27, change: -0.0141, volume24h: 642_300_000, openInterest: 228_900_000, fundingRate: 0.0001, maxLeverage: 50, tick: 0.01, tags: ["crypto"] },
  { symbol: "PERP_SOL_USDC", price: 171.84, change: 0.0512, volume24h: 318_400_000, openInterest: 96_200_000, fundingRate: 0.00021, maxLeverage: 20, tick: 0.01, tags: ["crypto"] },
  { symbol: "PERP_HYPE_USDC", price: 38.214, change: 0.0827, volume24h: 154_800_000, openInterest: 61_400_000, fundingRate: 0.00034, maxLeverage: 10, tick: 0.001, tags: ["crypto", "new"], listedAt: NOW - 6 * DAY, badge: "New" },
  { symbol: "PERP_XRP_USDC", price: 0.6142, change: -0.0062, volume24h: 88_100_000, openInterest: 31_700_000, fundingRate: 0.00008, maxLeverage: 20, tick: 0.0001, tags: ["crypto"] },
  { symbol: "PERP_DOGE_USDC", price: 0.16418, change: 0.0318, volume24h: 74_900_000, openInterest: 27_300_000, fundingRate: 0.00015, maxLeverage: 20, tick: 0.00001, tags: ["crypto"] },
  { symbol: "PERP_SUI_USDC", price: 1.9284, change: -0.0427, volume24h: 52_600_000, openInterest: 18_800_000, fundingRate: -0.00004, maxLeverage: 10, tick: 0.0001, tags: ["crypto"] },
  { symbol: "PERP_LINK_USDC", price: 14.382, change: 0.0091, volume24h: 31_200_000, openInterest: 12_900_000, fundingRate: 0.0001, maxLeverage: 20, tick: 0.001, tags: ["crypto"] },
  { symbol: "PERP_TIA_USDC", price: 5.124, change: -0.0718, volume24h: 12_400_000, openInterest: 6_100_000, fundingRate: -0.00019, maxLeverage: 10, tick: 0.001, tags: ["crypto"] },
  { symbol: "PERP_MON_USDC", price: 0.04126, change: 0.1934, volume24h: 9_700_000, openInterest: 3_200_000, fundingRate: 0.00061, maxLeverage: 5, tick: 0.00001, tags: ["crypto", "new"], listedAt: NOW - 2 * DAY, badge: "New" },
  { symbol: "PERP_WIF_USDC", price: 1.842, change: -0.0233, volume24h: 420_000, openInterest: 1_100_000, fundingRate: 0.00012, maxLeverage: 10, tick: 0.001, tags: ["crypto"] },
  { symbol: "PERP_NVDA_USDC", price: 182.46, change: 0.0124, volume24h: 41_500_000, openInterest: 14_200_000, fundingRate: 0.00005, maxLeverage: 10, tick: 0.01, tags: ["rwa", "stocks"], badge: "RWA" },
  { symbol: "PERP_TSLA_USDC", price: 438.12, change: -0.0196, volume24h: 28_300_000, openInterest: 9_800_000, fundingRate: 0.00007, maxLeverage: 10, tick: 0.01, tags: ["rwa", "stocks"], badge: "RWA" },
  { symbol: "PERP_XAU_USDC", price: 4108.3, change: 0.0042, volume24h: 22_700_000, openInterest: 11_500_000, fundingRate: 0.00002, maxLeverage: 20, tick: 0.1, tags: ["rwa", "metals"], badge: "RWA" },
  { symbol: "PERP_EURUSD_USDC", price: 1.08342, change: -0.0011, volume24h: 6_800_000, openInterest: 4_400_000, fundingRate: 0.00001, maxLeverage: 25, tick: 0.00001, tags: ["rwa", "fx"], badge: "FX" },
];

const tagged = (tag: string) => (m: Market) => m.tags?.includes(tag) ?? false;
const TABS: MarketsTab[] = [
  FAVORITES_TAB,
  { value: "all", label: "All" },
  { value: "new", label: "New", filter: tagged("new"), defaultSort: { key: "listedAt", direction: "desc" } },
  {
    value: "rwa",
    label: "RWA",
    filter: tagged("rwa"),
    subTabs: [
      { value: "all", label: "All" },
      { value: "stocks", label: "Stocks", filter: tagged("stocks") },
      { value: "metals", label: "Metals", filter: tagged("metals") },
      { value: "fx", label: "FX", filter: tagged("fx") },
    ],
  },
];

export default function MarketsListDemo() {
  const [favorites, setFavorites] = useState(["PERP_BTC_USDC", "PERP_SOL_USDC", "PERP_HYPE_USDC"]);
  const [symbol, setSymbol] = useState("PERP_BTC_USDC");
  return (
    <div className="h-[520px] w-full max-w-sm overflow-hidden rounded-2xl border border-border">
      <MarketsList
        className="h-full bg-container"
        markets={MARKETS}
        tabs={TABS}
        defaultTab="all"
        favorites={favorites}
        onFavoriteChange={(s, fav) => setFavorites((f) => (fav ? [...f, s] : f.filter((x) => x !== s)))}
        onPinToTop={(s) => setFavorites((f) => [s, ...f.filter((x) => x !== s)])}
        activeSymbol={symbol}
        onSymbolSelect={(m) => setSymbol(m.symbol)}
        lowVolumeThreshold={1_000_000}
      />
    </div>
  );
}
