import type { Candle } from "@/components/trading/chart-panel";
import type { Market } from "@/components/trading/markets-list";
import type { Order } from "@/components/trading/orders-table";
import type { Position } from "@/components/trading/positions-table";
import type { Trade } from "@/components/trading/recent-trades";

// Illustrative, deterministic fixtures only — replace with your exchange's market data and account state.

export const MARKETS: Market[] = [
  { symbol: "PERP_BTC_USDC", price: 67412.5, change: 0.0234, volume24h: 1_284_000_000, openInterest: 412_600_000, fundingRate: 0.000125, maxLeverage: 50, tick: 0.1 },
  { symbol: "PERP_ETH_USDC", price: 3184.27, change: -0.0141, volume24h: 642_000_000, openInterest: 198_300_000, fundingRate: 0.0001, maxLeverage: 50, tick: 0.01 },
  { symbol: "PERP_SOL_USDC", price: 162.84, change: 0.0587, volume24h: 318_000_000, openInterest: 88_400_000, fundingRate: 0.00021, maxLeverage: 25, tick: 0.01 },
  { symbol: "PERP_ARB_USDC", price: 0.9312, change: -0.0322, volume24h: 41_200_000, openInterest: 12_900_000, fundingRate: -0.00004, maxLeverage: 20, tick: 0.0001 },
  { symbol: "PERP_DOGE_USDC", price: 0.15873, change: 0.0912, volume24h: 96_700_000, openInterest: 31_500_000, fundingRate: 0.00033, maxLeverage: 20, tick: 0.00001 },
  { symbol: "PERP_LINK_USDC", price: 14.218, change: 0.0045, volume24h: 22_800_000, openInterest: 7_400_000, fundingRate: 0.00008, maxLeverage: 20, tick: 0.001 },
  { symbol: "PERP_AVAX_USDC", price: 28.41, change: -0.0218, volume24h: 18_300_000, openInterest: 6_100_000, fundingRate: 0.00006, maxLeverage: 20, tick: 0.01 },
];

/** A seeded random walk so the chart looks the same on every render. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function makeCandles(count = 96, last = 67412.5): Candle[] {
  const rand = seeded(42);
  const out: Candle[] = [];
  let close = last * 0.94;
  const start = Date.UTC(2026, 9, 20, 0, 0);
  for (let i = 0; i < count; i++) {
    const open = close;
    const drift = (last - open) / (count - i) + (rand() - 0.5) * last * 0.008;
    close = open + drift;
    const high = Math.max(open, close) + rand() * last * 0.003;
    const low = Math.min(open, close) - rand() * last * 0.003;
    out.push({ time: start + i * 15 * 60_000, open, high, low, close, volume: 40 + rand() * 160 });
  }
  return out;
}

export function makeBook(mid: number, tick: number) {
  const rand = seeded(7);
  const level = (i: number, dir: 1 | -1) => ({
    price: Number((mid + dir * (i + 1) * tick * 5).toFixed(2)),
    size: Number((0.2 + rand() * 4.5).toFixed(3)),
  });
  return {
    asks: Array.from({ length: 12 }, (_, i) => level(i, 1)),
    bids: Array.from({ length: 12 }, (_, i) => level(i, -1)),
  };
}

export function makeTrades(mid: number): Trade[] {
  const rand = seeded(99);
  const now = Date.UTC(2026, 9, 22, 14, 30);
  return Array.from({ length: 30 }, (_, i) => {
    const side = rand() > 0.48 ? "buy" : "sell";
    return {
      id: i,
      side,
      price: Number((mid + (rand() - 0.5) * 12).toFixed(1)),
      size: Number((0.01 + rand() * 1.2).toFixed(4)),
      time: now - i * 3_100,
    } satisfies Trade;
  });
}

export const POSITIONS: Position[] = [
  {
    id: "p1",
    symbol: "PERP_BTC_USDC",
    side: "long",
    quantity: 0.42,
    entryPrice: 65210.4,
    markPrice: 67408.2,
    liquidationPrice: 52880.1,
    leverage: 10,
    marginMode: "cross",
    margin: 2831.1,
    unrealizedPnl: 923.08,
    roi: 0.326,
    takeProfitPrice: 72000,
    stopLossPrice: 62500,
    tick: 0.1,
  },
  {
    id: "p2",
    symbol: "PERP_ETH_USDC",
    side: "short",
    quantity: 3.5,
    entryPrice: 3121.6,
    markPrice: 3184.27,
    liquidationPrice: 3790.4,
    leverage: 5,
    marginMode: "isolated",
    margin: 2228.99,
    unrealizedPnl: -219.35,
    roi: -0.0984,
    tick: 0.01,
  },
];

const T = Date.UTC(2026, 9, 22, 13, 0);
export const ORDERS: Order[] = [
  { id: "o1", symbol: "PERP_BTC_USDC", side: "buy", type: "limit", price: 66200, quantity: 0.15, filled: 0, status: "open", time: T },
  { id: "o2", symbol: "PERP_SOL_USDC", side: "sell", type: "limit", price: 171.5, quantity: 40, filled: 12.5, status: "partially_filled", time: T - 3_600_000 },
  { id: "o3", symbol: "PERP_BTC_USDC", side: "sell", type: "take_profit", triggerPrice: 72000, quantity: 0.42, status: "open", time: T - 7_200_000 },
  { id: "o4", symbol: "PERP_ETH_USDC", side: "buy", type: "market", avgPrice: 3121.6, quantity: 3.5, filled: 3.5, status: "filled", time: T - 86_400_000 },
];
