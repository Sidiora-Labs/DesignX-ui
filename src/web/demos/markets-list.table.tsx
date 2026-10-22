import { useState } from "react";

import { DEFAULT_MARKETS_TABS, MarketsList, type Market } from "@/components/trading/markets-list";

// Illustrative market snapshot only. Feed these from your market data source.
const DAY = 86_400_000;
const NOW = Date.UTC(2026, 9, 22);
const MARKETS: Market[] = [
  { symbol: "PERP_BTC_USDC", price: 67412.5, change: 0.0234, volume24h: 1_284_000_000, openInterest: 412_600_000, fundingRate: 0.000125, maxLeverage: 50, tick: 0.1 },
  { symbol: "PERP_ETH_USDC", price: 3184.27, change: -0.0141, volume24h: 642_300_000, openInterest: 228_900_000, fundingRate: 0.0001, maxLeverage: 50, tick: 0.01 },
  { symbol: "PERP_SOL_USDC", price: 171.84, change: 0.0512, volume24h: 318_400_000, openInterest: 96_200_000, fundingRate: 0.00021, maxLeverage: 20, tick: 0.01 },
  { symbol: "PERP_HYPE_USDC", price: 38.214, change: 0.0827, volume24h: 154_800_000, openInterest: 61_400_000, fundingRate: 0.00034, maxLeverage: 10, tick: 0.001, tags: ["new"], listedAt: NOW - 6 * DAY },
  { symbol: "PERP_XRP_USDC", price: 0.6142, change: -0.0062, volume24h: 88_100_000, openInterest: 31_700_000, fundingRate: 0.00008, maxLeverage: 20, tick: 0.0001 },
  { symbol: "PERP_DOGE_USDC", price: 0.16418, change: 0.0318, volume24h: 74_900_000, openInterest: 27_300_000, fundingRate: 0.00015, maxLeverage: 20, tick: 0.00001 },
  { symbol: "PERP_SUI_USDC", price: 1.9284, change: -0.0427, volume24h: 52_600_000, openInterest: 18_800_000, fundingRate: -0.00004, maxLeverage: 10, tick: 0.0001 },
  { symbol: "PERP_NVDA_USDC", price: 182.46, change: 0.0124, volume24h: 41_500_000, openInterest: 14_200_000, fundingRate: 0.00005, maxLeverage: 10, tick: 0.01, tags: ["rwa"], badge: "RWA" },
  { symbol: "PERP_XAU_USDC", price: 4108.3, change: 0.0042, volume24h: 22_700_000, openInterest: 11_500_000, fundingRate: 0.00002, maxLeverage: 20, tick: 0.1, tags: ["rwa"], badge: "RWA" },
  { symbol: "PERP_MON_USDC", price: 0.04126, change: 0.1934, volume24h: 9_700_000, openInterest: 3_200_000, fundingRate: 0.00061, maxLeverage: 5, tick: 0.00001, tags: ["new"], listedAt: NOW - 2 * DAY },
];

export default function MarketsListTableDemo() {
  const [favorites, setFavorites] = useState(["PERP_ETH_USDC"]);
  return (
    <div className="w-full max-w-5xl rounded-2xl bg-container p-4 sm:p-6">
      <MarketsList
        layout="table"
        className="bg-container"
        bodyClassName="max-h-[460px]"
        markets={MARKETS}
        tabs={DEFAULT_MARKETS_TABS}
        favorites={favorites}
        onFavoriteChange={(s, fav) => setFavorites((f) => (fav ? [...f, s] : f.filter((x) => x !== s)))}
        fundingLabel="8h funding"
        onSymbolSelect={() => {}}
      />
    </div>
  );
}
