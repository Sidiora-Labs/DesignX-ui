import { showTradeNotification, TradeNotification, type TradeNotificationData } from "@/components/trading/trade-notification";
import { Button } from "@/components/ui/button";

// Illustrative fixture data only — map your order / position stream events to these.
const NOW = Date.now();

const EVENTS: TradeNotificationData[] = [
  { kind: "filled", symbol: "PERP_BTC_USDC", side: "buy", orderType: "Limit", quantity: 0.5, filledQuantity: 0.5, price: 67_412.5, tick: 0.1, time: NOW - 12_000 },
  { kind: "partially-filled", symbol: "PERP_ETH_USDC", side: "sell", orderType: "Limit", quantity: 12, filledQuantity: 4.25, price: 3_184.27, tick: 0.01, time: NOW - 64_000 },
  { kind: "cancelled", symbol: "PERP_SOL_USDC", side: "buy", orderType: "Limit", quantity: 140, price: 171.42, tick: 0.01, reason: "Cancelled by you", time: NOW - 180_000 },
  { kind: "take-profit", symbol: "PERP_BTC_USDC", side: "sell", quantity: 0.25, price: 68_900, tick: 0.1, pnl: 1_284.5, time: NOW - 420_000 },
  { kind: "stop-loss", symbol: "PERP_ARB_USDC", side: "sell", quantity: 2_400, price: 0.8124, tick: 0.0001, pnl: -312.44, time: NOW - 900_000 },
];

const LIQUIDATION: TradeNotificationData = { kind: "liquidation-warning", symbol: "PERP_DOGE_USDC", marginRatio: 0.924, liquidationPrice: 0.13842, tick: 0.00001, time: NOW };

export default function TradeNotificationDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={() => showTradeNotification({ ...EVENTS[0], time: Date.now() })}>
          Toast: filled
        </Button>
        <Button size="sm" variant="outline" onClick={() => showTradeNotification({ ...EVENTS[1], time: Date.now() })}>
          Toast: partial
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => showTradeNotification({ ...LIQUIDATION, time: Date.now(), action: { label: "Add margin", onClick: () => {} } })}
        >
          Toast: liquidation
        </Button>
      </div>
      <TradeNotification {...LIQUIDATION} action={{ label: "Add margin", onClick: () => {} }} onDismiss={() => {}} />
      {EVENTS.map((e) => (
        <TradeNotification key={e.kind} {...e} />
      ))}
    </div>
  );
}
