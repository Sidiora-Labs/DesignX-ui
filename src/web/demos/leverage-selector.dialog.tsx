import { useState } from "react";
import { toast } from "sonner";

import { LeverageDialog } from "@/components/trading/leverage-selector";

// Illustrative values only.
export default function LeverageSelectorDialogDemo() {
  const [leverage, setLeverage] = useState(5);
  const [draft, setDraft] = useState(leverage);
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-muted-foreground">SOL-PERP leverage</span>
      <LeverageDialog
        symbol="PERP_SOL_USDC"
        side="sell"
        marginMode="isolated"
        value={leverage}
        max={20}
        onDraftChange={setDraft}
        onOpenChange={(open) => open && setDraft(leverage)}
        maxPositionNotional={(l) => Math.round(8_000_000 / l)}
        error={draft > 15 ? "Margin is not enough for this leverage. Try a lower level." : undefined}
        onConfirm={(l) => {
          setLeverage(l);
          toast.success(`Leverage updated to ${l}x`);
        }}
      />
    </div>
  );
}
