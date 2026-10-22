import { useState } from "react";
import { toast } from "sonner";

import { PositionHistory, type ClosedPosition, type LiquidationRecord } from "@/components/trading/position-history";

// Illustrative history only.
const T = Date.UTC(2026, 9, 22, 9, 30);
const h = (hours: number) => T - hours * 3_600_000;

const POSITIONS: ClosedPosition[] = [
  { id: "h1", symbol: "PERP_BTC_USDC", side: "long", leverage: 20, marginMode: "cross", status: "closed", openTime: h(30), closeTime: h(3), avgEntryPrice: 64_912.3, avgClosePrice: 66_840.1, closedQuantity: 0.3, maxQuantity: 0.3, realizedPnl: 578.34, fundingFee: -4.1182, tradingFee: -12.2632, netPnl: 561.96, tick: 0.1, baseDp: 4 },
  { id: "h2", symbol: "PERP_ETH_USDC", side: "short", leverage: 10, marginMode: "isolated", status: "partially_closed", openTime: h(52), closeTime: h(6), avgEntryPrice: 3_402.8, avgClosePrice: 3_351.12, closedQuantity: 1.5, maxQuantity: 8.3, realizedPnl: 77.52, fundingFee: 1.2041, tradingFee: -2.5133, netPnl: 76.21, tick: 0.01, baseDp: 3 },
  { id: "h3", symbol: "PERP_SOL_USDC", side: "long", leverage: 25, marginMode: "isolated", status: "liquidated", openTime: h(80), closeTime: h(61), avgEntryPrice: 171.4, avgClosePrice: 165.02, closedQuantity: 120, maxQuantity: 120, realizedPnl: -765.6, fundingFee: -3.84, tradingFee: -6.11, netPnl: -775.55, liquidation: { id: 88_412, liquidatorFee: 9.9, insuranceFundFee: 4.95 }, tick: 0.01, baseDp: 2 },
  { id: "h4", symbol: "PERP_DOGE_USDC", side: "short", leverage: 5, status: "adl", openTime: h(140), closeTime: h(118), avgEntryPrice: 0.1388, avgClosePrice: 0.1302, closedQuantity: 20_000, maxQuantity: 20_000, realizedPnl: 172, tick: 0.0001, baseDp: 0 },
];

const LIQUIDATIONS: LiquidationRecord[] = [
  { id: 88_412, time: h(61), symbol: "PERP_SOL_USDC", side: "long", markPrice: 165.02, quantity: 120, feeRate: 0.0125, fee: 14.85, marginRatio: 0.0291, maintenanceMarginRatio: 0.03, collateral: 576.2, notional: 19_802.4, tick: 0.01, baseDp: 2 },
];

export default function PositionHistoryDemo() {
  const [range, setRange] = useState("7d");
  return (
    <div className="w-full max-w-6xl">
      <PositionHistory
        positions={POSITIONS}
        liquidations={LIQUIDATIONS}
        range={range}
        onRangeChange={setRange}
        onShare={(p) => toast(`Share ${p.symbol} PnL card`)}
      />
    </div>
  );
}
