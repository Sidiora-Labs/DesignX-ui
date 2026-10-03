import * as React from "react";
import { SparklesIcon } from "lucide-react";

import { GlowBorder } from "@/components/dx/glow-border";
import { Switch } from "@/components/ui/switch";

export default function GlowBorderDemo() {
  const [active, setActive] = React.useState(true);
  return (
    <div className="grid w-full max-w-md justify-items-center gap-6">
      <div className="relative w-full rounded-[28px]">
        <GlowBorder active={active} />
        <div className="relative flex items-center gap-3 rounded-[28px] px-6 py-5">
          <SparklesIcon className="size-5 text-[var(--dx-blue-3)]" />
          <span className="text-[15px] text-muted-foreground">Ask anything…</span>
        </div>
      </div>
      <div className="flex items-center gap-2 text-sm">
        <Switch checked={active} onCheckedChange={setActive} aria-label="Thinking" />
        <span aria-hidden>Thinking</span>
      </div>
    </div>
  );
}
