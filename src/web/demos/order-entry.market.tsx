import { useState } from "react";
import { toast } from "sonner";

import { OrderEntry } from "@/components/trading/order-entry";

// Illustrative values only — a market sell on ETH with slippage control and a restricted type list.
const MARK = 3184.27;

export default function OrderEntryMarketDemo() {
  const [slippage, setSlippage] = useState(0.005);
  return (
    <div className="w-full max-w-[320px] rounded-2xl bg-background p-3 ring-1 ring-border">
      <OrderEntry
        symbol="PERP_ETH_USDC"
        tick={0.01}
        baseDp={3}
        orderTypes={["limit", "market", "stop-market"]}
        defaultValues={{ side: "sell", type: "market", quantity: "1.25", total: "3980.34" }}
        referencePrice={MARK}
        maxQuantity={18.402}
        available={5_860.1}
        marginMode="isolated"
        leverage={5}
        maxLeverage={25}
        onLeverageChange={(l) => toast(`Leverage set to ${l}x`)}
        onMarginModeChange={(m) => toast(`Margin mode: ${m}`)}
        estLiqPrice={3790.12}
        fees={{ taker: 0.0005, maker: 0.0002 }}
        slippage={slippage}
        estSlippage={0.00042}
        onSlippageChange={setSlippage}
        onSubmit={(v) => toast.success(`Market ${v.side} ${v.quantity} ETH sent`)}
      />
    </div>
  );
}
