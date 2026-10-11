import { useRef } from "react";

import ScrollImageReveal from "@/components/effects/scroll-image-reveal";
import { photo } from "@/lib/demo-data";

export default function ScrollImageRevealDemo() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div className="relative h-96 w-full max-w-xl overflow-y-auto rounded-2xl bg-muted/40" ref={ref}>
      <div className="flex flex-col items-center gap-6 px-6 py-[60%]">
        <p className="text-xs text-muted-foreground">Scroll inside this box</p>
        <ScrollImageReveal alt="Coastline" className="aspect-[4/3] w-full" container={ref} src={photo(4)} />
      </div>
    </div>
  );
}
