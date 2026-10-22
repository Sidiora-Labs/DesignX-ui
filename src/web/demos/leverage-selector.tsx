import { useState } from "react";
import { toast } from "sonner";

import { LeverageSelector } from "@/components/trading/leverage-selector";

// Illustrative values only. Max notional per leverage tier comes from your risk limits.
const TIERS = [
  { upTo: 10, notional: 50_000_000 },
  { upTo: 20, notional: 20_000_000 },
  { upTo: 25, notional: 10_000_000 },
  { upTo: 50, notional: 2_500_000 },
];

export default function LeverageSelectorDemo() {
  const [current, setCurrent] = useState(10);
  const [draft, setDraft] = useState(current);
  return (
    <div className="w-full max-w-sm rounded-2xl bg-background p-4 ring-1 ring-border">
      <LeverageSelector
        symbol="PERP_BTC_USDC"
        side="buy"
        marginMode="cross"
        max={50}
        value={draft}
        onValueChange={setDraft}
        currentLeverage={current}
        presets={[2, 5, 10, 20, 50]}
        maxPositionNotional={(l) => TIERS.find((t) => l <= t.upTo)?.notional ?? null}
        warnAbove={20}
        onCancel={() => setDraft(current)}
        onConfirm={(l) => {
          setCurrent(l);
          toast.success(`Leverage updated to ${l}x`);
        }}
      />
    </div>
  );
}
