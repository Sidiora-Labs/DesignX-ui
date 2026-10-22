import { useState } from "react";

import { PortfolioPerformance, type PerformancePoint } from "@/components/trading/portfolio-performance";

// Illustrative history only — a fixed, hand-shaped series. Feed real daily snapshots from your API.
const DAILY_PNL = [
  412, -186, 655, 120, -340, 288, 940, -512, 176, 368, -95, 701, 233, -418, 520, 61, -207, 845, 312, -144, 590, -630, 271, 448, -82, 366, 157, -301, 689, 214,
];

function buildSeries(days: number): PerformancePoint[] {
  const end = Date.UTC(2026, 9, 21);
  // Cycle the hand-shaped pattern with a small per-cycle drift for longer ranges.
  const pnl = Array.from({ length: days }, (_, i) => {
    const k = DAILY_PNL.length - days + i;
    const cycle = Math.floor(k / DAILY_PNL.length);
    return DAILY_PNL[((k % DAILY_PNL.length) + DAILY_PNL.length) % DAILY_PNL.length] + cycle * 37;
  });
  let value = 41800;
  return pnl.map((p, i) => {
    value += p + (i % 6 === 0 ? 1200 : 0); // occasional deposits
    return { date: end - (pnl.length - 1 - i) * 86_400_000, pnl: p, accountValue: value };
  });
}

const STATS: Record<string, { roi: number; pnl: number; volume: number }> = {
  "7D": { roi: 0.0412, pnl: 1854.2, volume: 1_284_330 },
  "30D": { roi: 0.0958, pnl: 4362.88, volume: 6_912_450 },
  "90D": { roi: 0.1734, pnl: 7690.12, volume: 18_402_100 },
};

const SERIES: Record<string, PerformancePoint[]> = { "7D": buildSeries(7), "30D": buildSeries(30), "90D": buildSeries(90) };

const DISTRIBUTION = [
  { token: "USDC", value: 28450.12 },
  { token: "ETH", value: 13432.85 },
  { token: "BTC", value: 5473.89 },
  { token: "SOL", value: 2701.49 },
];

export default function PortfolioPerformanceDemo() {
  const [range, setRange] = useState("30D");
  return (
    <div className="w-full max-w-4xl">
      <PortfolioPerformance
        data={SERIES[range]}
        {...STATS[range]}
        volumeNote="Updated ~02:15 UTC"
        range={range}
        onRangeChange={setRange}
        distribution={DISTRIBUTION}
      />
    </div>
  );
}
