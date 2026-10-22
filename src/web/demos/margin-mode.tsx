import { useState } from "react";

import { MarginModeOptions, MarginModeToggle, type MarginMode } from "@/components/trading/margin-mode";

// Illustrative state only — persist the chosen mode through your account API.
export default function MarginModeDemo() {
  const [mode, setMode] = useState<MarginMode>("cross");
  return (
    <div className="flex w-full max-w-sm flex-col gap-6">
      <MarginModeToggle value={mode} onValueChange={setMode} showDescription />
      <MarginModeOptions value={mode} onValueChange={setMode} currentMode="cross" />
    </div>
  );
}
