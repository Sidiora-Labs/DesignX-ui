import * as React from "react";

import { AutoscaleInput } from "@/components/dx/autoscale-input";

export default function AutoscaleInputDemo() {
  const [amount, setAmount] = React.useState(0);
  return (
    <div className="grid w-full max-w-md justify-items-center gap-3">
      <AutoscaleInput defaultValue="1250" aria-label="Amount" onValueChange={(_, n) => setAmount(Number.isNaN(n) ? 0 : n)} />
      <p className="text-[13px] text-muted-foreground tabular-nums">Parsed: {amount}</p>
    </div>
  );
}
