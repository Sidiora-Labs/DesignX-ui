import { toast } from "sonner";

import { ReversePositionDialog } from "@/components/trading/reverse-position";
import { Button } from "@/components/ui/button";

// Illustrative values only.
export default function ReversePositionDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ReversePositionDialog
        trigger={<Button variant="outline">Reverse BTC long</Button>}
        symbol="PERP_BTC_USDC"
        side="long"
        quantity={0.4215}
        leverage={20}
        markPrice={67_408.2}
        tick={0.1}
        baseDp={4}
        estimatedPnl={669.26}
        estimatedLiquidationPrice={80_512.3}
        onConfirm={() => toast.success("Reversed to 0.4215 BTC short")}
      />
      <ReversePositionDialog
        trigger={<Button variant="outline">Reverse tiny ETH short</Button>}
        symbol="PERP_ETH_USDC"
        side="short"
        quantity={0.002}
        leverage={10}
        markPrice={3_342.6}
        tick={0.01}
        baseDp={3}
        estimatedPnl={-0.12}
        error="The reverse order is below the minimum size. Close the position and place a new order instead."
      />
    </div>
  );
}
