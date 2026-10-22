import { useEffect, useState } from "react";

import { RecentTrades, type Trade } from "@/components/trading/recent-trades";

// Illustrative fills only — a deterministic generator stands in for your trades stream.
const START = Date.UTC(2026, 9, 22, 14, 32, 10);
function makeTrade(i: number): Trade {
  const wave = Math.sin(i * 0.7) * 6 + Math.sin(i * 0.13) * 14;
  return {
    id: i,
    price: Math.round((67_400 + wave) * 10) / 10,
    size: Math.round((0.002 + Math.abs(Math.sin(i * 2.3)) * (i % 7 === 0 ? 1.8 : 0.24)) * 10_000) / 10_000,
    time: START + i * 1_700,
    side: Math.sin(i * 1.9) > -0.1 ? "buy" : "sell",
  };
}

const MY_TRADES: Trade[] = [
  { id: "m3", price: 67_398.4, size: 0.12, time: START - 3 * 60_000, side: "buy" },
  { id: "m2", price: 67_455.1, size: 0.05, time: START - 41 * 60_000, side: "sell" },
  { id: "m1", price: 67_120.0, size: 0.25, time: START - 2 * 3_600_000, side: "buy" },
];

export default function RecentTradesDemo() {
  const [count, setCount] = useState(40);
  useEffect(() => {
    const id = window.setInterval(() => {
      if (!document.hidden) setCount((c) => c + 1);
    }, 1_400);
    return () => window.clearInterval(id);
  }, []);
  const trades = Array.from({ length: 40 }, (_, k) => makeTrade(count - 1 - k));

  return (
    <div className="h-[420px] w-full max-w-xs overflow-hidden rounded-2xl bg-container">
      <RecentTrades className="h-full bg-container" trades={trades} myTrades={MY_TRADES} base="BTC" quote="USDC" tick={0.1} limit={40} />
    </div>
  );
}
