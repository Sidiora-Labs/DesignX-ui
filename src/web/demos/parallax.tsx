import * as React from "react";
import { PlayIcon } from "lucide-react";

import { ParallaxImage, ScaleReveal } from "@/components/dx/parallax";

const img = (id: string) => `https://images.unsplash.com/${id}?w=1600&q=80&auto=format&fit=crop`;

export default function ParallaxDemo() {
  const box = React.useRef<HTMLDivElement>(null);
  return (
    <div ref={box} className="relative h-[520px] w-full overflow-y-auto overscroll-contain rounded-2xl bg-container">
      <ParallaxImage container={box} src={img("photo-1506905925346-21bda4d32df4")} speed={40} className="h-[340px]">
        <div className="flex size-full items-end bg-linear-to-t from-black/60 to-transparent p-6">
          <p className="text-xs tracking-[0.2em] text-white uppercase">Scroll inside this box</p>
        </div>
      </ParallaxImage>
      <div className="flex flex-col items-center py-12">
        <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">Documentary</p>
        <h3 className="mt-4 w-full border-y border-outline-variant py-2 text-center text-5xl font-medium tracking-tight md:text-7xl">
          Project X
        </h3>
      </div>
      <div className="px-6">
        <ScaleReveal container={box} organic src={img("photo-1501785888041-af3ef285b470")}>
          <span className="flex flex-col items-center gap-3 text-white">
            <PlayIcon className="size-14 fill-current" />
            <span className="text-xs tracking-[0.2em] uppercase">Watch trailer</span>
          </span>
        </ScaleReveal>
      </div>
      <div className="flex flex-col items-center gap-1 py-20 text-4xl font-medium uppercase">
        {["Production", "Documentary", "Film & TV"].map((t) => (
          <span key={t} className="w-full border-t border-outline-variant py-2 text-center last:border-b">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
