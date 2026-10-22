import { useState } from "react";
import { toast } from "sonner";

import { MarginModeDialog, type MarginMode, type MarginModeSettingsItem } from "@/components/trading/margin-mode";

// Illustrative per-symbol settings. Locked rows model community-listed markets that enforce isolated margin.
const INITIAL: MarginModeSettingsItem[] = [
  { symbol: "PERP_BTC_USDC", mode: "cross" },
  { symbol: "PERP_ETH_USDC", mode: "cross" },
  { symbol: "PERP_SOL_USDC", mode: "isolated" },
  { symbol: "PERP_ARB_USDC", mode: "cross" },
  { symbol: "PERP_DOGE_USDC", mode: "cross" },
  { symbol: "PERP_WIF_USDC", mode: "isolated", disabled: true, disabledReason: "Community-listed market — isolated margin is enforced." },
  { symbol: "PERP_SUI_USDC", mode: "cross" },
  { symbol: "PERP_TIA_USDC", mode: "isolated" },
];

export default function MarginModeDialogDemo() {
  const [mode, setMode] = useState<MarginMode>("cross");
  const [items, setItems] = useState(INITIAL);
  return (
    <MarginModeDialog
      symbol="PERP_BTC_USDC"
      value={mode}
      onValueChange={(m) => {
        setMode(m);
        setItems((list) => list.map((i) => (i.symbol === "PERP_BTC_USDC" ? { ...i, mode: m } : i)));
        toast.success(`BTC-PERP switched to ${m} margin`);
      }}
      settings={items}
      onApplySettings={(symbols, m) => {
        setItems((list) => list.map((i) => (symbols.includes(i.symbol) ? { ...i, mode: m } : i)));
        toast.success(`Updated ${symbols.length} symbols to ${m}`);
      }}
    />
  );
}
