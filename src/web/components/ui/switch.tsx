import { Switch as SwitchPrimitive } from "@base-ui/react/switch";

import { cn } from "@/lib/utils";

function Switch({ className, size = "default", ...props }: SwitchPrimitive.Root.Props & { size?: "sm" | "default" }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "group/switch peer focus-ring relative inline-flex shrink-0 items-center rounded-full border-2 border-muted-foreground/60 bg-container-highest transition-[background-color,border-color] duration-200 ease-(--ease-dx)",
        "data-[size=default]:h-7 data-[size=default]:w-[46px] data-[size=sm]:h-5 data-[size=sm]:w-8",
        "data-checked:border-primary data-checked:bg-primary data-disabled:pointer-events-none data-disabled:opacity-40",
        className,
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className={cn(
          "pointer-events-none block rounded-full bg-muted-foreground shadow-sm transition-[translate,width,height,background-color] duration-200 ease-(--ease-dx)",
          "group-data-[size=default]/switch:size-3.5 group-data-[size=default]/switch:translate-x-1 group-data-[size=default]/switch:data-checked:size-5 group-data-[size=default]/switch:data-checked:translate-x-[20px]",
          "group-data-[size=sm]/switch:size-2.5 group-data-[size=sm]/switch:translate-x-0.5 group-data-[size=sm]/switch:data-checked:size-3 group-data-[size=sm]/switch:data-checked:translate-x-[14px]",
          "data-checked:bg-primary-foreground group-active/switch:not-data-disabled:scale-110",
        )}
      />
    </SwitchPrimitive.Root>
  );
}

export { Switch };
