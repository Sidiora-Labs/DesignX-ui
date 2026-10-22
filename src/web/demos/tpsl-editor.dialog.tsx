import { toast } from "sonner";

import { TpslDialog } from "@/components/trading/tpsl-editor";
import { Button } from "@/components/ui/button";

// Illustrative short position. Existing TP/SL are passed in as the starting draft.
export default function TpslEditorDialogDemo() {
  return (
    <TpslDialog
      trigger={<Button variant="outline">Edit TP/SL</Button>}
      position={{ symbol: "PERP_ETH_USDC", side: "sell", size: 12.5, entryPrice: 3240.55, markPrice: 3184.27, liqPrice: 3702.9, leverage: 10, marginMode: "isolated" }}
      tick={0.01}
      baseDp={3}
      defaultValue={{
        tp: { triggerPrice: "2980.00", orderType: "market", orderPrice: "" },
        sl: { triggerPrice: "", orderType: "market", orderPrice: "" },
        scope: "partial",
        quantity: "6.25",
      }}
      onSubmit={(v) => toast.success(`TP ${v.tp.triggerPrice || "—"} / SL ${v.sl.triggerPrice || "—"} saved`)}
    />
  );
}
