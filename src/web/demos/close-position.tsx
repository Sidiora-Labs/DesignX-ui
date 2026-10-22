import { toast } from "sonner";

import { CloseAllPositionsDialog, ClosePositionDialog } from "@/components/trading/close-position";
import { Button } from "@/components/ui/button";

// Illustrative position only — a 0.42 BTC long opened at 65,820.4.
const ENTRY = 65_820.4;
const MARK = 67_408.2;

export default function ClosePositionDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <ClosePositionDialog
        trigger={<Button variant="outline">Close BTC long</Button>}
        symbol="PERP_BTC_USDC"
        side="long"
        positionQuantity={0.4215}
        markPrice={MARK}
        leverage={20}
        tick={0.1}
        baseDp={4}
        estimatedPnl={({ price, quantity }) => ((price ?? MARK) - ENTRY) * quantity}
        onConfirm={(o) => toast.success(`${o.orderType === "market" ? "Market" : "Limit"} close ${o.quantity} BTC${o.price ? ` @ ${o.price}` : ""}`)}
      />
      <CloseAllPositionsDialog
        trigger={<Button variant="tonal">Close all</Button>}
        counts={{ all: 4, profitable: 3, losing: 1 }}
        onConfirm={(scope) => toast.success(`Closing ${scope} positions at market`)}
      />
    </div>
  );
}
