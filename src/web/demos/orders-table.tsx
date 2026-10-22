import { useState } from "react";
import { toast } from "sonner";

import { OrdersTable, type Order } from "@/components/trading/orders-table";

// Illustrative orders only — feed these from your order stream.
const T = Date.UTC(2026, 9, 22, 9, 30);
const min = (m: number) => T - m * 60_000;

const ORDERS: Order[] = [
  { id: "o1", symbol: "PERP_BTC_USDC", side: "buy", type: "limit", price: 66_200, quantity: 0.25, filled: 0.08, status: "partially_filled", time: min(4), takeProfitPrice: 70_500, stopLossPrice: 64_800, tick: 0.1, baseDp: 4 },
  { id: "o2", symbol: "PERP_ETH_USDC", side: "sell", type: "limit", price: 3_420.5, quantity: 3.2, filled: 0, status: "open", time: min(17), tick: 0.01, baseDp: 3 },
  { id: "o3", symbol: "PERP_SOL_USDC", side: "buy", type: "stop_limit", price: 158.2, triggerPrice: 157.5, quantity: 40, status: "open", time: min(42), reduceOnly: false, tick: 0.01, baseDp: 2 },
  { id: "o4", symbol: "PERP_BTC_USDC", side: "sell", type: "take_profit", triggerPrice: 71_000, quantity: 0.4215, status: "open", time: min(65), reduceOnly: true, tick: 0.1, baseDp: 4 },
  { id: "o5", symbol: "PERP_BTC_USDC", side: "sell", type: "stop_loss", triggerPrice: 63_500, quantity: 0.4215, status: "open", time: min(65), reduceOnly: true, tick: 0.1, baseDp: 4 },
  { id: "o6", symbol: "PERP_ETH_USDC", side: "sell", type: "market", quantity: 1.5, filled: 1.5, avgPrice: 3_351.12, status: "filled", time: min(120), realizedPnl: 84.31, fee: 2.5133, tick: 0.01, baseDp: 3 },
  { id: "o7", symbol: "PERP_SOL_USDC", side: "buy", type: "limit", price: 148.3, quantity: 145, filled: 145, avgPrice: 148.32, status: "filled", time: min(380), realizedPnl: 0, fee: 6.4519, tick: 0.01, baseDp: 2 },
  { id: "o8", symbol: "PERP_ARB_USDC", side: "buy", type: "limit", price: 0.8125, quantity: 2_500, filled: 0, status: "cancelled", time: min(900), tick: 0.0001, baseDp: 0 },
  { id: "o9", symbol: "PERP_DOGE_USDC", side: "sell", type: "stop_market", triggerPrice: 0.1412, quantity: 12_000, status: "rejected", time: min(1_440), tick: 0.0001, baseDp: 0 },
];

export default function OrdersTableDemo() {
  const [orders, setOrders] = useState(ORDERS);
  const cancel = (ids: string[]) => setOrders((all) => all.map((o) => (ids.includes(o.id) ? { ...o, status: "cancelled" } : o)));
  return (
    <div className="w-full max-w-6xl">
      <OrdersTable
        orders={orders}
        markPrices={{ PERP_BTC_USDC: 67_408.2, PERP_ETH_USDC: 3_342.6, PERP_SOL_USDC: 152.87 }}
        onEdit={(order, edit) => {
          setOrders((all) => all.map((o) => (o.id === order.id ? { ...o, ...edit } : o)));
          toast.success(`Edited ${order.symbol} order`);
        }}
        onCancel={(order) => {
          cancel([order.id]);
          toast(`Cancelled ${order.symbol} order`);
        }}
        onCancelAll={(_, list) => {
          cancel(list.map((o) => o.id));
          toast(`Cancelled ${list.length} orders`);
        }}
        onShare={(o) => toast(`Share ${o.symbol} fill`)}
      />
    </div>
  );
}
