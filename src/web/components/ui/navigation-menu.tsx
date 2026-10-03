import { NavigationMenu as NavigationMenuPrimitive } from "@base-ui/react/navigation-menu";
import { ChevronDownIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function NavigationMenu({ className, children, ...props }: NavigationMenuPrimitive.Root.Props) {
  return (
    <NavigationMenuPrimitive.Root data-slot="navigation-menu" className={cn("relative min-w-max", className)} {...props}>
      {children}
      <NavigationMenuPositioner />
    </NavigationMenuPrimitive.Root>
  );
}

function NavigationMenuList({ className, ...props }: NavigationMenuPrimitive.List.Props) {
  return <NavigationMenuPrimitive.List data-slot="navigation-menu-list" className={cn("flex items-center gap-0.5", className)} {...props} />;
}

function NavigationMenuItem(props: NavigationMenuPrimitive.Item.Props) {
  return <NavigationMenuPrimitive.Item data-slot="navigation-menu-item" {...props} />;
}

const navigationMenuTriggerStyle =
  "state-layer focus-ring inline-flex h-9 items-center justify-center gap-1 rounded-full px-3.5 text-sm font-medium text-foreground/80 no-underline transition-colors outline-none select-none hover:text-foreground data-popup-open:text-foreground";

function NavigationMenuTrigger({ className, children, ...props }: NavigationMenuPrimitive.Trigger.Props) {
  return (
    <NavigationMenuPrimitive.Trigger data-slot="navigation-menu-trigger" className={cn(navigationMenuTriggerStyle, className)} {...props}>
      {children}
      <NavigationMenuPrimitive.Icon className="transition-transform duration-200 ease-(--ease-dx) data-popup-open:rotate-180">
        <ChevronDownIcon className="size-3.5 text-muted-foreground" />
      </NavigationMenuPrimitive.Icon>
    </NavigationMenuPrimitive.Trigger>
  );
}

function NavigationMenuContent({ className, ...props }: NavigationMenuPrimitive.Content.Props) {
  return (
    <NavigationMenuPrimitive.Content
      data-slot="navigation-menu-content"
      className={cn(
        "h-full w-[calc(100vw-40px)] p-2 sm:w-max",
        "transition-[opacity,translate] duration-(--duration) ease-(--easing) data-starting-style:opacity-0 data-ending-style:opacity-0",
        "data-starting-style:data-[activation-direction=left]:-translate-x-1/2 data-starting-style:data-[activation-direction=right]:translate-x-1/2",
        "data-ending-style:data-[activation-direction=left]:translate-x-1/2 data-ending-style:data-[activation-direction=right]:-translate-x-1/2",
        className,
      )}
      {...props}
    />
  );
}

function NavigationMenuPositioner() {
  return (
    <NavigationMenuPrimitive.Portal>
      <NavigationMenuPrimitive.Positioner
        sideOffset={8}
        collisionPadding={{ top: 5, bottom: 5, left: 20, right: 20 }}
        collisionAvoidance={{ side: "none" }}
        className="z-50 h-(--positioner-height) w-(--positioner-width) max-w-(--available-width) transition-[top,left,right,bottom] duration-(--duration) ease-(--easing) data-instant:transition-none"
        style={{ ["--duration" as string]: "0.35s", ["--easing" as string]: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        <NavigationMenuPrimitive.Popup className="relative h-(--popup-height) w-(--popup-width) origin-(--transform-origin) rounded-xl border border-outline-variant bg-popover text-popover-foreground shadow-float outline-none transition-[opacity,transform,width,height,scale] duration-(--duration) ease-(--easing) data-ending-style:scale-95 data-ending-style:opacity-0 data-ending-style:duration-150 data-starting-style:scale-95 data-starting-style:opacity-0">
          <NavigationMenuPrimitive.Viewport className="relative h-full w-full overflow-hidden" />
        </NavigationMenuPrimitive.Popup>
      </NavigationMenuPrimitive.Positioner>
    </NavigationMenuPrimitive.Portal>
  );
}

function NavigationMenuLink({ className, ...props }: NavigationMenuPrimitive.Link.Props) {
  return (
    <NavigationMenuPrimitive.Link
      data-slot="navigation-menu-link"
      className={cn(
        "focus-ring flex flex-col gap-1 rounded-md p-3 text-sm no-underline transition-colors outline-none hover:bg-container data-active:bg-container",
        className,
      )}
      {...props}
    />
  );
}

export {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  navigationMenuTriggerStyle,
};
