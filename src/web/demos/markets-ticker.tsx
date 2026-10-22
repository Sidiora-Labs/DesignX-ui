import { useState } from "react";

import { MarketsTicker, type TickerMarket } from "@/components/trading/markets-ticker";

// Illustrative prices only. Feed these from your ticker stream.
const MARKETS: TickerMarket[] = [
  { symbol: "PERP_BTC_USDC", price: 67412.5, change: 0.0234, tick: 0.1, tags: ["crypto"] },
  { symbol: "PERP_ETH_USDC", price: 3184.27, change: -0.0141, tick: 0.01, tags: ["crypto"] },
  { symbol: "PERP_SOL_USDC", price: 171.84, change: 0.0512, tick: 0.01, tags: ["crypto"] },
  { symbol: "PERP_HYPE_USDC", price: 38.214, change: 0.0827, tick: 0.001, tags: ["crypto", "new"] },
  { symbol: "PERP_XRP_USDC", price: 0.6142, change: -0.0062, tick: 0.0001, tags: ["crypto"] },
  { symbol: "PERP_DOGE_USDC", price: 0.16418, change: 0.0318, tick: 0.00001, tags: ["crypto"] },
  { symbol: "PERP_SUI_USDC", price: 1.9284, change: -0.0427, tick: 0.0001, tags: ["crypto"] },
  { symbol: "PERP_LINK_USDC", price: 14.382, change: 0.0091, tick: 0.001, tags: ["crypto"] },
  { symbol: "PERP_MON_USDC", price: 0.04126, change: 0.1934, tick: 0.00001, tags: ["crypto", "new"] },
  { symbol: "PERP_NVDA_USDC", price: 182.46, change: 0.0124, tick: 0.01, tags: ["rwa"] },
  { symbol: "PERP_TSLA_USDC", price: 438.12, change: -0.0196, tick: 0.01, tags: ["rwa"] },
  { symbol: "PERP_XAU_USDC", price: 4108.3, change: 0.0042, tick: 0.1, tags: ["rwa"] },
];

export default function MarketsTickerDemo() {
  const [symbol, setSymbol] = useState("PERP_BTC_USDC");
  return (
    <div className="w-full max-w-4xl">
      <MarketsTicker markets={MARKETS} activeSymbol={symbol} onSymbolClick={setSymbol} />
    </div>
  );
}
