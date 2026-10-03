import * as React from "react";
import { Slider as SliderPrimitive } from "@base-ui/react/slider";

import { cn } from "@/lib/utils";

function Slider({ className, defaultValue, value, min = 0, max = 100, ...props }: SliderPrimitive.Root.Props) {
  const values = React.useMemo(() => {
    const v = value ?? defaultValue;
    return Array.isArray(v) ? v : v !== undefined ? [v] : [min];
  }, [value, defaultValue, min]);

  return (
    <SliderPrimitive.Root
      data-slot="slider"
      className={cn("data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full", className)}
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center py-2 select-none data-disabled:opacity-40 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-40 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col data-[orientation=vertical]:px-2">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative grow overflow-visible rounded-full bg-container-highest select-none data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="rounded-full bg-primary select-none data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          />
          {values.map((_, i) => (
            <SliderPrimitive.Thumb
              key={i}
              data-slot="slider-thumb"
              className="block h-5 w-1.5 rounded-full bg-primary ring-4 ring-background transition-[width,height] duration-150 ease-(--ease-dx) outline-none select-none hover:w-2 focus-visible:ring-ring/40 data-dragging:w-2 data-[orientation=vertical]:h-1.5 data-[orientation=vertical]:w-5"
            />
          ))}
        </SliderPrimitive.Track>
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  );
}

export { Slider };
