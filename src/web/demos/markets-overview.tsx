import { MarketsOverview, type OverviewMarket } from "@/components/trading/markets-overview";

// Illustrative market snapshot only. Feed these from your market data source.
const DAY = 86_400_000;
const NOW = Date.UTC(2026, 9, 22);
const MARKETS: OverviewMarket[] = [
  { symbol: "PERP_BTC_USDC", price: 67412.5, change: 0.0234, volume24h: 1_284_000_000, tick: 0.1, listedAt: NOW - 900 * DAY },
  { symbol: "PERP_ETH_USDC", price: 3184.27, change: -0.0141, volume24h: 642_300_000, tick: 0.01, listedAt: NOW - 900 * DAY },
  { symbol: "PERP_SOL_USDC", price: 171.84, change: 0.0512, volume24h: 318_400_000, tick: 0.01, listedAt: NOW - 700 * DAY },
  { symbol: "PERP_HYPE_USDC", price: 38.214, change: 0.0827, volume24h: 154_800_000, tick: 0.001, listedAt: NOW - 6 * DAY },
  { symbol: "PERP_XRP_USDC", price: 0.6142, change: -0.0062, volume24h: 88_100_000, tick: 0.0001, listedAt: NOW - 600 * DAY },
  { symbol: "PERP_DOGE_USDC", price: 0.16418, change: 0.0318, volume24h: 74_900_000, tick: 0.00001, listedAt: NOW - 500 * DAY },
  { symbol: "PERP_SUI_USDC", price: 1.9284, change: -0.0427, volume24h: 52_600_000, tick: 0.0001, listedAt: NOW - 300 * DAY },
  { symbol: "PERP_TIA_USDC", price: 5.124, change: -0.0718, volume24h: 12_400_000, tick: 0.001, listedAt: NOW - 250 * DAY },
  { symbol: "PERP_MON_USDC", price: 0.04126, change: 0.1934, volume24h: 9_700_000, tick: 0.00001, listedAt: NOW - 2 * DAY },
  { symbol: "PERP_ENA_USDC", price: 0.4821, change: -0.0512, volume24h: 18_200_000, tick: 0.0001, listedAt: NOW - 14 * DAY },
  { symbol: "PERP_NVDA_USDC", price: 182.46, change: 0.0124, volume24h: 41_500_000, tick: 0.01, listedAt: NOW - 9 * DAY },
  { symbol: "PERP_WIF_USDC", price: 1.842, change: -0.0233, volume24h: 420_000, tick: 0.001, listedAt: NOW - 200 * DAY },
];

export default function MarketsOverviewDemo() {
  return (
    <div className="w-full max-w-6xl">
      <MarketsOverview
        markets={MARKETS}
        totalVolume24h={2_741_600_000}
        totalOpenInterest={986_400_000}
        tvl={412_800_000}
        onSymbolSelect={() => {}}
      />
    </div>
  );
}
