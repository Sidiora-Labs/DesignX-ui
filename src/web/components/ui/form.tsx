import { Form as FormPrimitive } from "@base-ui/react/form";

import { cn } from "@/lib/utils";

function Form({ className, ...props }: FormPrimitive.Props) {
  return <FormPrimitive data-slot="form" className={cn("flex w-full flex-col gap-5", className)} {...props} />;
}

export { Form };
