import * as React from "react";
import { useMotionValue } from "motion/react";

import { BreakpointIndicator, DebugPanel } from "@/components/dx/dev-tools";

export default function DevToolsDemo() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [clicks, setClicks] = React.useState(0);
  const [key, setKey] = React.useState("");

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => setKey(e.key);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    // oxlint-disable-next-line jsx-a11y/click-events-have-key-events jsx-a11y/no-static-element-interactions
    <div
      className="grid h-72 w-full place-items-center gap-4 rounded-2xl bg-container"
      onPointerMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        x.set(Math.round(e.clientX - r.left));
        y.set(Math.round(e.clientY - r.top));
      }}
      onClick={() => setClicks((c) => c + 1)}
    >
      <DebugPanel force title="debug" values={{ x, y, clicks, lastKey: key, ready: true }} />
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        Breakpoint <BreakpointIndicator force position={false} />
      </div>
    </div>
  );
}
