import { useState } from "react";

import { MarketSelector } from "@/components/trading/market-selector";
import type { Market } from "@/components/trading/markets-list";
import { Numeral } from "@/components/trading/numeral";
import { TONE_TEXT, toneOf } from "@/lib/trading";

// Illustrative market snapshot only. Feed these from your market data source.
const MARKETS: Market[] = [
  { symbol: "PERP_BTC_USDC", price: 67412.5, change: 0.0234, volume24h: 1_284_000_000, openInterest: 412_600_000, maxLeverage: 50, tick: 0.1 },
  { symbol: "PERP_ETH_USDC", price: 3184.27, change: -0.0141, volume24h: 642_300_000, openInterest: 228_900_000, maxLeverage: 50, tick: 0.01 },
  { symbol: "PERP_SOL_USDC", price: 171.84, change: 0.0512, volume24h: 318_400_000, openInterest: 96_200_000, maxLeverage: 20, tick: 0.01 },
  { symbol: "PERP_HYPE_USDC", price: 38.214, change: 0.0827, volume24h: 154_800_000, openInterest: 61_400_000, maxLeverage: 10, tick: 0.001, tags: ["new"], listedAt: 2 },
  { symbol: "PERP_XRP_USDC", price: 0.6142, change: -0.0062, volume24h: 88_100_000, openInterest: 31_700_000, maxLeverage: 20, tick: 0.0001 },
  { symbol: "PERP_DOGE_USDC", price: 0.16418, change: 0.0318, volume24h: 74_900_000, openInterest: 27_300_000, maxLeverage: 20, tick: 0.00001 },
  { symbol: "PERP_SUI_USDC", price: 1.9284, change: -0.0427, volume24h: 52_600_000, openInterest: 18_800_000, maxLeverage: 10, tick: 0.0001 },
  { symbol: "PERP_LINK_USDC", price: 14.382, change: 0.0091, volume24h: 31_200_000, openInterest: 12_900_000, maxLeverage: 20, tick: 0.001 },
  { symbol: "PERP_NVDA_USDC", price: 182.46, change: 0.0124, volume24h: 41_500_000, openInterest: 14_200_000, maxLeverage: 10, tick: 0.01, tags: ["rwa"], badge: "RWA" },
  { symbol: "PERP_XAU_USDC", price: 4108.3, change: 0.0042, volume24h: 22_700_000, openInterest: 11_500_000, maxLeverage: 20, tick: 0.1, tags: ["rwa"], badge: "RWA" },
  { symbol: "PERP_MON_USDC", price: 0.04126, change: 0.1934, volume24h: 9_700_000, openInterest: 3_200_000, maxLeverage: 5, tick: 0.00001, tags: ["new"], listedAt: 1 },
];

export default function MarketSelectorDemo() {
  const [symbol, setSymbol] = useState("PERP_BTC_USDC");
  const [favorites, setFavorites] = useState(["PERP_BTC_USDC", "PERP_ETH_USDC"]);
  const market = MARKETS.find((m) => m.symbol === symbol)!;
  return (
    <div className="flex w-full max-w-md items-center justify-between gap-3 rounded-xl bg-container px-2 py-1.5">
      <MarketSelector
        symbol={symbol}
        badge={`${market.maxLeverage}x`}
        markets={MARKETS}
        favorites={favorites}
        onFavoriteChange={(s, fav) => setFavorites((f) => (fav ? [...f, s] : f.filter((x) => x !== s)))}
        onSymbolSelect={(m) => setSymbol(m.symbol)}
      />
      <div className="flex flex-col items-end pr-2">
        <Numeral value={market.price} tick={market.tick} className={`text-sm font-semibold ${TONE_TEXT[toneOf(market.change)]}`} />
        <Numeral value={market.change} rule="percent" showSign coloring className="text-[11px]" />
      </div>
    </div>
  );
}
