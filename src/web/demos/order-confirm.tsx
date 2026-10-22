import { toast } from "sonner";

import { OrderConfirmDialog } from "@/components/trading/order-confirm";
import { Button } from "@/components/ui/button";

// Illustrative order. Fee and liquidation estimates come from your pricing logic.
export default function OrderConfirmDemo() {
  return (
    <OrderConfirmDialog
      trigger={<Button variant="outline">Review order</Button>}
      tick={0.1}
      order={{
        symbol: "PERP_BTC_USDC",
        side: "buy",
        type: "limit",
        quantity: 0.25,
        price: 67380,
        leverage: 10,
        marginMode: "cross",
        execution: "post-only",
        fee: 3.37,
        estLiqPrice: 61228.4,
        tpsl: { scope: "entire", tpTriggerPrice: 71000, slTriggerPrice: 65200, slOrderPrice: 65150 },
      }}
      onConfirm={() => toast.success("Order sent")}
      onDontShowAgainChange={(skip) => toast(skip ? "Confirmation turned off" : "Confirmation turned on")}
    />
  );
}
