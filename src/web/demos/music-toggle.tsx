import * as React from "react";

import { MusicToggle } from "@/components/dx/music-toggle";

export default function MusicToggleDemo() {
  const [playing, setPlaying] = React.useState(false);
  return (
    <div className="flex flex-col items-center gap-5">
      <MusicToggle playing={playing} onPlayingChange={setPlaying} />
      <p className="text-sm text-muted-foreground">{playing ? "Playing" : "Paused"}pass `src` to play a real track</p>
    </div>
  );
}
