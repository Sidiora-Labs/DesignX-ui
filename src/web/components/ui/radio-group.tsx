import { Radio as RadioPrimitive } from "@base-ui/react/radio";
import { RadioGroup as RadioGroupPrimitive } from "@base-ui/react/radio-group";

import { cn } from "@/lib/utils";

function RadioGroup({ className, ...props }: RadioGroupPrimitive.Props) {
  return <RadioGroupPrimitive data-slot="radio-group" className={cn("grid gap-3", className)} {...props} />;
}

function RadioGroupItem({ className, ...props }: RadioPrimitive.Root.Props) {
  return (
    <RadioPrimitive.Root
      data-slot="radio-group-item"
      className={cn(
        "peer focus-ring relative inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border-[1.5px] border-muted-foreground/70 transition-colors duration-150",
        "after:absolute after:-inset-2.5 after:rounded-full after:bg-current after:opacity-0 after:transition-opacity hover:after:opacity-[0.06]",
        "data-checked:border-primary data-disabled:pointer-events-none data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <RadioPrimitive.Indicator
        data-slot="radio-group-indicator"
        className="size-2.5 rounded-full bg-primary transition-[scale] duration-200 ease-(--ease-dx) data-starting-style:scale-0 data-ending-style:scale-0 data-unchecked:hidden"
      />
    </RadioPrimitive.Root>
  );
}

export { RadioGroup, RadioGroupItem };
