import { useState } from "react";

import { Numeral, Statistic } from "@/components/trading/numeral";
import { Switch } from "@/components/ui/switch";

export default function NumeralDemo() {
  const [hidden, setHidden] = useState(false);
  return (
    <div className="flex w-full max-w-md flex-col gap-6">
      <div className="grid grid-cols-2 gap-x-8 gap-y-5 sm:grid-cols-3">
        <Statistic label="Total value">
          <Numeral value={128_402.5} rule="usd" hidden={hidden} />
        </Statistic>
        <Statistic label="Unrealized PnL">
          <Numeral value={2_314.08} coloring showSign unit="USDC" hidden={hidden} />
        </Statistic>
        <Statistic label="24h change">
          <Numeral value={-0.0182} rule="percent" coloring showSign />
        </Statistic>
        <Statistic label="Mark price">
          <Numeral value={0.000012874} dp={9} />
        </Statistic>
        <Statistic label="Volume">
          <Numeral value={8_412_000_000} rule="compact" prefix="$" />
        </Statistic>
        <Statistic label="Funding">
          <Numeral value={null} />
        </Statistic>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Switch id="numeral-hide" checked={hidden} onCheckedChange={setHidden} />
        <label htmlFor="numeral-hide">Hide balances</label>
      </div>
    </div>
  );
}
