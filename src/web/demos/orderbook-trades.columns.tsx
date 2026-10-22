import { OrderBookTrades } from "@/components/trading/orderbook-trades";
import type { Trade } from "@/components/trading/recent-trades";

// Illustrative snapshot only. Feed bids, asks and trades from your market data stream.
const MID = 67_412.5;
const ASK_SIZES = [0.412, 1.208, 0.086, 2.54, 0.73, 0.318, 3.92, 1.06, 0.244, 5.1];
const BID_SIZES = [0.928, 0.154, 1.73, 0.61, 2.18, 0.402, 1.44, 4.36, 0.88, 2.95];
const ASKS = ASK_SIZES.map((size, i) => ({ price: Math.round((MID + 0.5 + i * 1.5) * 10) / 10, size }));
const BIDS = BID_SIZES.map((size, i) => ({ price: Math.round((MID - 0.5 - i * 1.5) * 10) / 10, size }));

const START = Date.UTC(2026, 9, 22, 14, 32, 10);
const TRADES: Trade[] = Array.from({ length: 36 }, (_, i) => ({
  id: i,
  price: Math.round((MID + Math.sin(i * 0.8) * 4) * 10) / 10,
  size: Math.round((0.003 + Math.abs(Math.sin(i * 2.1)) * 0.4) * 10_000) / 10_000,
  time: START - i * 2_300,
  side: Math.sin(i * 1.7) > 0 ? "buy" : "sell",
}));

export default function OrderBookTradesColumnsDemo() {
  return (
    <div className="h-[460px] w-full max-w-3xl">
      <OrderBookTrades
        layout="columns"
        className="h-full"
        bids={BIDS}
        asks={ASKS}
        trades={TRADES}
        lastPrice={MID}
        base="BTC"
        quote="USDC"
        tick={0.1}
        levels={8}
      />
    </div>
  );
}
