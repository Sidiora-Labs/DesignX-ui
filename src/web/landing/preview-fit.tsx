import * as React from "react";

import { cn } from "@/lib/utils";

const HOVER_LIFT = 1.04;
const MIN_SCALE = 0.22;
/** Desktop-like width the preview lays out at before it is scaled into the card. */
const STAGE_WIDTH = 480;

/**
 * Renders a preview at a fixed stage width, measures it, and scales the whole
 * stage down to fit its frameno clipping, no collapsed "mobile" layouts.
 */
export function PreviewFit({ children, hover, maxScale = 0.82 }: { children: React.ReactNode; hover: boolean; maxScale?: number }) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const stageRef = React.useRef<HTMLDivElement>(null);
  const [fit, setFit] = React.useState(MIN_SCALE);
  const [measured, setMeasured] = React.useState(false);

  React.useLayoutEffect(() => {
    const outer = outerRef.current;
    const stage = stageRef.current;
    if (!outer || !stage) return;
    const measure = () => {
      const w = outer.clientWidth;
      const h = outer.clientHeight;
      const kids = Array.from(stage.children, (c) => c as HTMLElement);
      const cw = Math.max(stage.offsetWidth, stage.scrollWidth, ...kids.map((k) => Math.max(k.offsetWidth, k.scrollWidth)));
      const ch = Math.max(stage.offsetHeight, stage.scrollHeight, ...kids.map((k) => Math.max(k.offsetHeight, k.scrollHeight)));
      if (!w || !h || !cw || !ch) return;
      setFit(Math.max(MIN_SCALE, Math.min((w * 0.92) / cw, (h * 0.92) / ch)));
      setMeasured(true);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outer);
    ro.observe(stage);
    for (const k of Array.from(stage.children)) ro.observe(k);
    return () => ro.disconnect();
  }, []);

  const scale = Math.min(maxScale, fit) * (hover ? HOVER_LIFT : 1);

  return (
    <div
      ref={outerRef}
      className="relative m-2 mb-0 flex min-h-0 flex-1 items-center justify-center overflow-hidden rounded-[22px] bg-background contain-[paint]"
    >
      <div
        ref={stageRef}
        inert
        style={{ width: STAGE_WIDTH, transform: `scale(${scale})` }}
        className={cn(
          "pointer-events-none flex shrink-0 origin-center items-center justify-center",
          measured ? "transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]" : "invisible",
        )}
      >
        {children}
      </div>
    </div>
  );
}
