import { useState } from "react";

import { NotificationCenter, type TradeNotificationItem } from "@/components/trading/trade-notification";

// Illustrative fixture data only — keep this list in your own store as order events arrive.
const NOW = Date.now();

const ITEMS: TradeNotificationItem[] = [
  { id: "n1", kind: "liquidation-warning", symbol: "PERP_DOGE_USDC", marginRatio: 0.912, liquidationPrice: 0.13842, tick: 0.00001, time: NOW - 30_000 },
  { id: "n2", kind: "filled", symbol: "PERP_BTC_USDC", side: "buy", orderType: "Market", quantity: 0.2, filledQuantity: 0.2, price: 67_418.9, tick: 0.1, time: NOW - 95_000 },
  { id: "n3", kind: "partially-filled", symbol: "PERP_ETH_USDC", side: "sell", orderType: "Limit", quantity: 12, filledQuantity: 7.5, price: 3_190, tick: 0.01, time: NOW - 240_000 },
  { id: "n4", kind: "take-profit", symbol: "PERP_SOL_USDC", side: "sell", quantity: 80, price: 176.2, tick: 0.01, pnl: 612.4, time: NOW - 1_800_000, read: true },
  { id: "n5", kind: "rejected", symbol: "PERP_BTC_USDC", side: "buy", orderType: "Limit", quantity: 3, price: 66_000, tick: 0.1, reason: "Insufficient margin", time: NOW - 3_600_000, read: true },
  { id: "n6", kind: "opened", symbol: "PERP_ARB_USDC", side: "buy", orderType: "Stop market", quantity: 1_500, price: 0.84, tick: 0.0001, time: NOW - 7_200_000, read: true },
];

export default function TradeNotificationCenterDemo() {
  const [items, setItems] = useState(ITEMS);
  return (
    <div className="flex w-full max-w-md items-center justify-between rounded-xl bg-container px-3 py-2">
      <span className="text-sm font-medium">DX Trade</span>
      <NotificationCenter
        items={items}
        onItemClick={(item) => setItems((list) => list.map((i) => (i.id === item.id ? { ...i, read: true } : i)))}
        onMarkAllRead={() => setItems((list) => list.map((i) => ({ ...i, read: true })))}
        onClear={() => setItems([])}
      />
    </div>
  );
}
