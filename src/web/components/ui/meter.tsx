import { Meter as MeterPrimitive } from "@base-ui/react/meter";

import { cn } from "@/lib/utils";

function Meter({ className, children, indicatorClassName, ...props }: MeterPrimitive.Root.Props & { indicatorClassName?: string }) {
  return (
    <MeterPrimitive.Root data-slot="meter" className={cn("flex w-full flex-wrap items-center gap-x-3 gap-y-2", className)} {...props}>
      {children}
      <MeterPrimitive.Track data-slot="meter-track" className="relative h-2 w-full basis-full overflow-hidden rounded-full bg-container-highest">
        <MeterPrimitive.Indicator
          data-slot="meter-indicator"
          className={cn("h-full rounded-full bg-chart-1 transition-[width] duration-500 ease-(--ease-dx)", indicatorClassName)}
        />
      </MeterPrimitive.Track>
    </MeterPrimitive.Root>
  );
}

function MeterLabel({ className, ...props }: MeterPrimitive.Label.Props) {
  return <MeterPrimitive.Label data-slot="meter-label" className={cn("text-sm font-medium", className)} {...props} />;
}

function MeterValue({ className, ...props }: MeterPrimitive.Value.Props) {
  return <MeterPrimitive.Value data-slot="meter-value" className={cn("ml-auto text-sm text-muted-foreground tabular-nums", className)} {...props} />;
}

export { Meter, MeterLabel, MeterValue };
