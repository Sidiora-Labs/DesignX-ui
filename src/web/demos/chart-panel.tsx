import { useState } from "react";

import { Candles, ChartPanel, type Candle, type ChartType } from "@/components/trading/chart-panel";

// Illustrative candles only — a seeded random walk stands in for your OHLC feed.
function makeCandles(count: number, intervalMs: number, seed: number): Candle[] {
  let s = seed;
  const rand = () => {
    s = (s * 16_807) % 2_147_483_647;
    return s / 2_147_483_647;
  };
  const start = Date.UTC(2026, 9, 22, 0, 0) - count * intervalMs;
  let close = 66_200;
  return Array.from({ length: count }, (_, i) => {
    const open = close;
    const drift = Math.sin(i / 9) * 22 + (rand() - 0.47) * 120;
    close = Math.round((open + drift) * 10) / 10;
    const high = Math.max(open, close) + rand() * 60;
    const low = Math.min(open, close) - rand() * 60;
    return { time: start + i * intervalMs, open, high: Math.round(high * 10) / 10, low: Math.round(low * 10) / 10, close, volume: Math.round((40 + rand() * 160 + Math.abs(drift)) * 1000) / 1000 };
  });
}

const INTERVAL_MS: Record<string, number> = { "1m": 60_000, "5m": 300_000, "15m": 900_000, "1h": 3_600_000, "4h": 14_400_000, "1D": 86_400_000, "1W": 604_800_000 };

export default function ChartPanelDemo() {
  const [interval, setChartInterval] = useState("15m");
  const [type, setType] = useState<ChartType>("candles");
  const data = makeCandles(72, INTERVAL_MS[interval] ?? 900_000, ([...interval].reduce((h, c) => h * 31 + c.charCodeAt(0), 7) % 2_147_483_646) + 1);
  return (
    <div className="h-[440px] w-full max-w-4xl">
      <ChartPanel
        className="h-full"
        interval={interval}
        onIntervalChange={setChartInterval}
        chartType={type}
        onChartTypeChange={setType}
        chartTypes={["candles", "hollow", "line", "area"]}
        onIndicatorsClick={() => {}}
        displayOptions={[
          { id: "positions", label: "Positions" },
          { id: "orders", label: "Limit orders" },
          { id: "tpsl", label: "TP / SL" },
          { id: "liquidation", label: "Liquidation price" },
        ]}
      >
        <Candles data={data} type={type} tick={0.1} label="BTC-PERP price" />
      </ChartPanel>
    </div>
  );
}
