import * as React from "react";

import {
  DynamicIsland,
  IslandBattery,
  IslandCall,
  IslandIdle,
  IslandMusic,
  IslandRecord,
  IslandRing,
  IslandTimer,
} from "@/components/dx/dynamic-island";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

const views = ["idle", "ring", "silent", "timer", "record", "music", "battery", "call"] as const;
type View = (typeof views)[number];

export default function DynamicIslandDemo() {
  const [view, setView] = React.useState<View>("idle");

  const content: Record<View, React.ReactNode> = {
    idle: <IslandIdle />,
    ring: <IslandRing />,
    silent: <IslandRing silent />,
    timer: <IslandTimer seconds={272} />,
    record: <IslandRecord />,
    music: <IslandMusic />,
    battery: <IslandBattery level={9} />,
    call: <IslandCall onAccept={() => setView("idle")} onDecline={() => setView("idle")} />,
  };

  return (
    <div className="flex w-full flex-col items-center gap-10">
      <div className="flex h-24 items-start">
        <DynamicIsland view={view}>{content[view]}</DynamicIsland>
      </div>
      <ToggleGroup
        value={[view]}
        onValueChange={(v) => v[0] && setView(v[0] as View)}
        className="flex-wrap justify-center"
        aria-label="Island state"
      >
        {views.map((v) => (
          <ToggleGroupItem key={v} value={v} size="sm" className="capitalize">
            {v}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}
