import { toast } from "sonner";

import { ScaledOrderConfirmDialog } from "@/components/trading/order-confirm";
import { Button } from "@/components/ui/button";

// Illustrative scaled buy from 3,190 down to 3,100 in 8 orders. The first child crosses the best ask.
const ORDERS = Array.from({ length: 8 }, (_, i) => ({
  price: Math.round((3190 - (90 / 7) * i) * 100) / 100,
  quantity: Math.round((0.4 + i * 0.05) * 1000) / 1000,
}));

export default function OrderConfirmScaledDemo() {
  return (
    <ScaledOrderConfirmDialog
      trigger={<Button variant="outline">Review scaled order</Button>}
      symbol="PERP_ETH_USDC"
      side="buy"
      orders={ORDERS}
      tick={0.01}
      baseDp={3}
      bestAsk={3184.5}
      bestBid={3184.2}
      onConfirm={() => toast.success(`${ORDERS.length} orders placed`)}
    />
  );
}
