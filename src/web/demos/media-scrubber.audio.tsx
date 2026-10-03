import * as React from "react";
import { animate, useMotionValue } from "motion/react";
import { PauseIcon, PlayIcon } from "lucide-react";

import { Scrubber } from "@/components/dx/media-scrubber";
import { Button } from "@/components/ui/button";

/** The bare Scrubber, driven by any MotionValuehere a simulated 3:24 track. */
export default function ScrubberDemo() {
  const value = useMotionValue(42);
  const max = useMotionValue(204);
  const [playing, setPlaying] = React.useState(false);
  const anim = React.useRef<ReturnType<typeof animate> | null>(null);

  const play = () => {
    anim.current?.stop();
    const from = value.get() >= 204 ? 0 : value.get();
    anim.current = animate(value, 204, { from, duration: 204 - from, ease: "linear", onComplete: () => setPlaying(false) });
    setPlaying(true);
  };
  const pause = () => {
    anim.current?.stop();
    setPlaying(false);
  };
  React.useEffect(() => () => anim.current?.stop(), []);

  return (
    <div className="flex w-full max-w-md items-center gap-4 rounded-xl bg-container p-4">
      <Button size="icon" aria-label={playing ? "Pause" : "Play"} onClick={playing ? pause : play}>
        {playing ? <PauseIcon /> : <PlayIcon />}
      </Button>
      <Scrubber
        className="flex-1"
        value={value}
        max={max}
        onScrubStart={pause}
        onChange={(v) => value.set(v)}
      />
    </div>
  );
}
