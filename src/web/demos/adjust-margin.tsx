import { useState } from "react";
import { toast } from "sonner";

import { AdjustMarginDialog, type AdjustMarginMode } from "@/components/trading/adjust-margin";
import { Button } from "@/components/ui/button";

// Illustrative isolated ETH short. The liquidation preview below is a rough stand-in —
// compute the real value with your risk engine.
const QTY = 6.8;
const ENTRY = 3_284.15;
const MARGIN = 2_233.22;
const MMR = 0.01;

const liqFor = (margin: number) => ENTRY + margin / QTY - ENTRY * MMR;

export default function AdjustMarginDemo() {
  const [after, setAfter] = useState<{ liq: number; lev: number } | null>(null);
  const preview = (value: number, mode: AdjustMarginMode) => {
    if (!value) return setAfter(null);
    const margin = MARGIN + (mode === "add" ? value : -value);
    setAfter({ liq: liqFor(margin), lev: (QTY * 3_342.6) / margin });
  };
  return (
    <AdjustMarginDialog
      trigger={<Button variant="outline">Adjust margin</Button>}
      symbol="PERP_ETH_USDC"
      side="short"
      leverage={10}
      currentMargin={MARGIN}
      maxAdd={8_420.15}
      maxRemove={893.29}
      liquidationPrice={liqFor(MARGIN)}
      liquidationPriceAfter={after?.liq ?? null}
      leverageAfter={after?.lev ?? null}
      tick={0.01}
      onAmountChange={(_, { value, mode }) => preview(value, mode)}
      onOpenChange={(open) => !open && setAfter(null)}
      onConfirm={(a) => toast.success(`${a.mode === "add" ? "Added" : "Removed"} ${a.amount} USDC margin`)}
    />
  );
}
