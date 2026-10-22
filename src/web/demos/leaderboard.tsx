import { useMemo, useState } from "react";

import { Leaderboard, type LeaderboardEntry, type LeaderboardMetric } from "@/components/trading/leaderboard";

// Illustrative fixture data only — feed real rankings from your leaderboard API.
const TRADERS: Omit<LeaderboardEntry, "rank">[] = [
  { address: "0x7a3f9c2e81b4d05f6a9e3c1b2d4f8e7a6c5b9d01", name: "whale.eth", volume: 184_220_430.12, pnl: 1_284_330.4, roi: 0.412 },
  { address: "0x1b2c3d4e5f60718293a4b5c6d7e8f90123456789", volume: 142_908_112.5, pnl: 902_118.75, roi: 0.287 },
  { address: "0x9f8e7d6c5b4a39281706f5e4d3c2b1a098765432", name: "deltaneutral", volume: 98_441_067.3, pnl: -212_904.1, roi: -0.064 },
  { address: "0x4c5d6e7f8091a2b3c4d5e6f708192a3b4c5d6e7f", volume: 77_310_982.0, pnl: 611_870.0, roi: 0.533 },
  { address: "0xa1b2c3d4e5f60718293a4b5c6d7e8f9012345678", volume: 64_002_118.9, pnl: 188_440.2, roi: 0.091 },
  { address: "0x2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f", name: "gm-trader", volume: 51_870_440.6, pnl: 73_002.55, roi: 0.122 },
  { address: "0x5f6e7d8c9b0a1f2e3d4c5b6a7980f1e2d3c4b5a6", volume: 43_118_009.1, pnl: -48_220.0, roi: -0.031 },
  { address: "0x8d9c0b1a2f3e4d5c6b7a8f9e0d1c2b3a4f5e6d7c", volume: 38_640_551.7, pnl: 402_116.8, roi: 0.618 },
];

const YOU_ADDRESS = "0x3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d";
const YOU_STATS = { volume: 1_204_330.5, pnl: 18_420.12, roi: 0.084 };

const PERIOD_SCALE: Record<string, number> = { "24h": 0.06, "7d": 0.31, "30d": 1, all: 3.4 };

export default function LeaderboardDemo() {
  const [metric, setMetric] = useState<LeaderboardMetric>("volume");
  const [period, setPeriod] = useState("30d");

  // A stand-in for the server: scale by period, sort by the active metric and rank.
  const entries = useMemo(() => {
    const k = PERIOD_SCALE[period] ?? 1;
    return TRADERS.map((t) => ({ ...t, volume: (t.volume ?? 0) * k, pnl: (t.pnl ?? 0) * k }))
      .toSorted((a, b) => (b[metric] ?? 0) - (a[metric] ?? 0))
      .map((t, i) => ({ ...t, rank: i + 1 }));
  }, [metric, period]);

  return (
    <div className="w-full max-w-4xl">
      <Leaderboard
        title="Trading leaderboard"
        updatedAt="Updated every 30s"
        entries={entries}
        you={{ address: YOU_ADDRESS, rank: 1_284, ...YOU_STATS }}
        metric={metric}
        onMetricChange={setMetric}
        period={period}
        onPeriodChange={setPeriod}
        hasMore
        onLoadMore={() => {}}
        onAddressClick={() => {}}
      />
    </div>
  );
}
