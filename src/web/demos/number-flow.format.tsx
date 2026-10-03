import * as React from "react";

import { NumberFlow } from "@/components/dx/number-flow";
import { Button } from "@/components/ui/button";

const pct = { style: "percent", maximumFractionDigits: 1 } as const;
const compact = { notation: "compact", maximumFractionDigits: 1 } as const;
const eur = { style: "currency", currency: "EUR" } as const;

export default function NumberFlowFormatDemo() {
  const [n, setN] = React.useState(0.42);
  return (
    <div className="grid justify-items-center gap-6">
      <div className="grid grid-cols-3 gap-8 text-center">
        <div>
          <NumberFlow value={n} format={pct} className="text-3xl" />
          <div className="mt-1 text-xs text-muted-foreground">Percent</div>
        </div>
        <div>
          <NumberFlow value={n * 4_800_000} format={compact} className="text-3xl" />
          <div className="mt-1 text-xs text-muted-foreground">Compact</div>
        </div>
        <div>
          <NumberFlow value={n * 1000} locale="de-DE" format={eur} className="text-3xl" />
          <div className="mt-1 text-xs text-muted-foreground">de-DE currency</div>
        </div>
      </div>
      <Button variant="tonal" onClick={() => setN(Math.random())}>
        Update
      </Button>
    </div>
  );
}
