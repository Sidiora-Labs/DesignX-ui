import { NumberField as NumberFieldPrimitive } from "@base-ui/react/number-field";
import { MinusIcon, PlusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function NumberField({ className, children, ...props }: NumberFieldPrimitive.Root.Props) {
  return (
    <NumberFieldPrimitive.Root data-slot="number-field" className={cn("flex flex-col gap-2", className)} {...props}>
      {children}
    </NumberFieldPrimitive.Root>
  );
}

function NumberFieldGroup({ className, ...props }: NumberFieldPrimitive.Group.Props) {
  return (
    <NumberFieldPrimitive.Group
      data-slot="number-field-group"
      className={cn(
        "flex h-10 w-fit items-center rounded-full border border-input transition-[border-color,box-shadow] focus-within:border-foreground focus-within:shadow-[0_0_0_3px_var(--outline-variant)] data-disabled:opacity-40",
        className,
      )}
      {...props}
    />
  );
}

const stepper =
  "state-layer focus-ring flex size-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors select-none hover:text-foreground data-disabled:pointer-events-none data-disabled:opacity-30";

function NumberFieldDecrement({ className, children, ...props }: NumberFieldPrimitive.Decrement.Props) {
  return (
    <NumberFieldPrimitive.Decrement data-slot="number-field-decrement" className={cn(stepper, "ml-1", className)} {...props}>
      {children ?? <MinusIcon className="size-4" />}
    </NumberFieldPrimitive.Decrement>
  );
}

function NumberFieldIncrement({ className, children, ...props }: NumberFieldPrimitive.Increment.Props) {
  return (
    <NumberFieldPrimitive.Increment data-slot="number-field-increment" className={cn(stepper, "mr-1", className)} {...props}>
      {children ?? <PlusIcon className="size-4" />}
    </NumberFieldPrimitive.Increment>
  );
}

function NumberFieldInput({ className, ...props }: NumberFieldPrimitive.Input.Props) {
  return (
    <NumberFieldPrimitive.Input
      data-slot="number-field-input"
      className={cn("h-full w-16 bg-transparent text-center text-sm font-medium tabular-nums outline-none", className)}
      {...props}
    />
  );
}

function NumberFieldScrubArea({ className, children, ...props }: NumberFieldPrimitive.ScrubArea.Props) {
  return (
    <NumberFieldPrimitive.ScrubArea data-slot="number-field-scrub-area" className={cn("cursor-ew-resize select-none", className)} {...props}>
      {children}
      <NumberFieldPrimitive.ScrubAreaCursor className="drop-shadow-[0_1px_1px_#0008] filter">
        <svg width="26" height="14" viewBox="0 0 24 14" fill="black" stroke="white">
          <path d="M19.5 5.5L6.49737 5.51844V2L1 6.9999L6.5 12L6.49737 8.5L19.5 8.5V12L25 6.9999L19.5 2V5.5Z" />
        </svg>
      </NumberFieldPrimitive.ScrubAreaCursor>
    </NumberFieldPrimitive.ScrubArea>
  );
}

function NumberFieldStepper(props: Omit<NumberFieldPrimitive.Root.Props, "children">) {
  return (
    <NumberField {...props}>
      <NumberFieldGroup>
        <NumberFieldDecrement />
        <NumberFieldInput />
        <NumberFieldIncrement />
      </NumberFieldGroup>
    </NumberField>
  );
}

export {
  NumberField,
  NumberFieldGroup,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
  NumberFieldScrubArea,
  NumberFieldStepper,
};
