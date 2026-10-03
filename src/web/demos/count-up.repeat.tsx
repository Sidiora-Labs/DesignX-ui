import * as React from "react";
import { RotateCcwIcon } from "lucide-react";

import { CountUp } from "@/components/dx/count-up";
import { Button } from "@/components/ui/button";

const FORMAT: Intl.NumberFormatOptions = { maximumFractionDigits: 1, minimumFractionDigits: 1 };

export default function CountUpRepeat() {
  const [run, setRun] = React.useState(0);
  return (
    <div className="grid justify-items-center gap-4">
      <CountUp key={run} to={98.6} format={FORMAT} suffix="%" duration={1.6} ease="easeOut" className="text-7xl font-medium tracking-[-0.04em]" />
      <Button variant="tonal" size="sm" onClick={() => setRun((r) => r + 1)}>
        <RotateCcwIcon /> Replay
      </Button>
    </div>
  );
}
