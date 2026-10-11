import { useRef } from "react";

import KineticTypeScroll from "@/components/text/kinetic-type-scroll";

export default function KineticTypeScrollDemo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-80 w-full max-w-xl overflow-y-auto rounded-2xl bg-muted/40" ref={ref}>
      <div className="flex h-[200%] flex-col justify-center px-8 py-40">
        <p className="mb-6 text-center text-xs text-muted-foreground">Scroll inside this box</p>
        <KineticTypeScroll
          align="center"
          className="text-5xl font-semibold tracking-tight"
          container={ref}
          words={["Design", "systems", "that", "move", "with", "you"]}
        />
      </div>
    </div>
  );
}
