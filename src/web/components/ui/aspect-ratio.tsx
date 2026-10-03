import * as React from "react";

import { cn } from "@/lib/utils";

function AspectRatio({ ratio = 1, className, style, ...props }: React.ComponentProps<"div"> & { ratio?: number }) {
  return (
    <div
      data-slot="aspect-ratio"
      className={cn("relative w-full overflow-hidden", className)}
      style={{ aspectRatio: String(ratio), ...style }}
      {...props}
    />
  );
}

export { AspectRatio };
