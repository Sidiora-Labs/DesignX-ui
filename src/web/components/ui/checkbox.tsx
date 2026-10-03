import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox";
import { CheckIcon, MinusIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer focus-ring relative inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border-[1.5px] border-muted-foreground/70 bg-transparent text-primary-foreground transition-[background-color,border-color] duration-150 ease-(--ease-dx)",
        "after:absolute after:-inset-2.5 after:rounded-full after:bg-current after:opacity-0 after:transition-opacity hover:after:opacity-[0.06]",
        "data-checked:border-primary data-checked:bg-primary data-indeterminate:border-primary data-indeterminate:bg-primary",
        "data-invalid:border-destructive data-disabled:pointer-events-none data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center transition-[scale,opacity] duration-150 data-ending-style:scale-50 data-ending-style:opacity-0 data-starting-style:scale-50 data-starting-style:opacity-0 data-unchecked:hidden"
        render={(p, state) => (
          <span {...p}>
            {state.indeterminate ? <MinusIcon className="size-3.5" strokeWidth={3} /> : <CheckIcon className="size-3.5" strokeWidth={3} />}
          </span>
        )}
      />
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
