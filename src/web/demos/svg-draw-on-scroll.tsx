import { useRef } from "react";

import SvgDrawOnScroll from "@/components/effects/svg-draw-on-scroll";

export default function SvgDrawOnScrollDemo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-96 w-full max-w-xl overflow-y-auto rounded-2xl bg-muted/40" ref={ref}>
      <div className="flex flex-col items-center gap-6 px-6 py-[50%]">
        <p className="text-xs text-muted-foreground">Scroll inside this box</p>
        <SvgDrawOnScroll className="h-64 w-full text-primary" container={ref} />
      </div>
    </div>
  );
}
