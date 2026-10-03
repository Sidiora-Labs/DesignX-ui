import * as React from "react";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export default function SliderDemo() {
  const [volume, setVolume] = React.useState(62);
  return (
    <div className="grid w-full max-w-sm gap-8">
      <div className="grid gap-3">
        <div className="flex justify-between">
          <Label>Volume</Label>
          <span className="text-[13px] text-muted-foreground tabular-nums">{volume}%</span>
        </div>
        <Slider value={volume} onValueChange={(v) => setVolume(v as number)} />
      </div>
      <div className="grid gap-3">
        <Label>Price range</Label>
        <Slider defaultValue={[20, 75]} />
      </div>
      <Slider defaultValue={40} disabled />
    </div>
  );
}
