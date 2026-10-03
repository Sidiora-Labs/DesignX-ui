import * as React from "react";
import { MinusIcon, PlusIcon, ShuffleIcon } from "lucide-react";

import { NumberFlow } from "@/components/dx/number-flow";
import { Button } from "@/components/ui/button";

export default function NumberFlowDemo() {
  const [value, setValue] = React.useState(1248.5);
  return (
    <div className="grid justify-items-center gap-6">
      <NumberFlow value={value} prefix="$" className="text-6xl font-normal tracking-[-0.03em]" />
      <div className="flex gap-2">
        <Button variant="tonal" size="icon" aria-label="Decrease" onClick={() => setValue((v) => Math.max(0, v - 100))}>
          <MinusIcon />
        </Button>
        <Button variant="outline" onClick={() => setValue(Math.round(Math.random() * 99999) / 10)}>
          <ShuffleIcon /> Randomize
        </Button>
        <Button variant="tonal" size="icon" aria-label="Increase" onClick={() => setValue((v) => v + 100)}>
          <PlusIcon />
        </Button>
      </div>
    </div>
  );
}
