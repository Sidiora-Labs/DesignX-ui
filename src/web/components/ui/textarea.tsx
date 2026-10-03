import * as React from "react";

import { cn } from "@/lib/utils";

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "field-sizing-content flex min-h-20 w-full rounded-md border border-input bg-transparent px-3.5 py-2.5 text-sm transition-[border-color,box-shadow] duration-150 ease-(--ease-dx) outline-none",
        "placeholder:text-muted-foreground/70 hover:border-foreground/30 focus-visible:border-foreground focus-visible:shadow-[0_0_0_3px_var(--outline-variant)]",
        "disabled:cursor-not-allowed disabled:bg-container disabled:opacity-60 aria-invalid:border-destructive",
        className,
      )}
      {...props}
    />
  );
}

export { Textarea };
