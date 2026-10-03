import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Gooey / Squircle SVG filters. Render <GooeyFilter /> once, then apply
 * `style={{ filter: "url(#dx-goo)" }}` (or <Gooey>) to any group of shapes.
 *
 */

type GooeyFilterProps = {
  id?: string;
  /** Blur radiushigher melts shapes together from further away. */
  blur?: number;
  /** Alpha contrast multiplier. */
  contrast?: number;
  /** Alpha threshold offset. */
  threshold?: number;
};

function GooeyFilter({ id = "dx-goo", blur = 4.4, contrast = 20, threshold = -7 }: GooeyFilterProps) {
  return (
    <svg aria-hidden className="pointer-events-none absolute size-0" xmlns="http://www.w3.org/2000/svg" version="1.1">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values={`1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 ${contrast} ${threshold}`}
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
}

/** Squircle preset: a heavier blur that rounds rectangles into superellipses. */
function SquircleFilter({ id = "dx-squircle", blur = 10 }: { id?: string; blur?: number }) {
  return <GooeyFilter id={id} blur={blur} />;
}

type GooeyProps = React.ComponentProps<"div"> & { filterId?: string; blur?: number };

/** Wraps children in a gooey filter, rendering its own scoped <filter>. */
function Gooey({ filterId, blur = 4.4, className, style, children, ...props }: GooeyProps) {
  const auto = React.useId().replace(/:/g, "");
  const id = filterId ?? `dx-goo-${auto}`;
  return (
    <>
      <GooeyFilter id={id} blur={blur} />
      <div data-slot="gooey" className={cn("relative", className)} style={{ filter: `url(#${id})`, ...style }} {...props}>
        {children}
      </div>
    </>
  );
}

export { Gooey, GooeyFilter, SquircleFilter };
export type { GooeyFilterProps, GooeyProps };
