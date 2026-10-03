import * as React from "react";
import { ContextMenu as ContextMenuPrimitive } from "@base-ui/react/context-menu";
import { CheckIcon, ChevronRightIcon } from "lucide-react";

import { cn } from "@/lib/utils";

const menuPopup =
  "popup-motion max-h-(--available-height) min-w-48 overflow-y-auto rounded-lg border border-outline-variant bg-popover p-1.5 text-popover-foreground shadow-float outline-none";
const menuItem =
  "relative flex h-9 cursor-default items-center gap-2.5 rounded-sm px-2.5 text-sm outline-none select-none data-highlighted:bg-container-high data-disabled:pointer-events-none data-disabled:opacity-40 data-[variant=destructive]:text-destructive [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='text-'])]:text-muted-foreground";

function ContextMenu(props: ContextMenuPrimitive.Root.Props) {
  return <ContextMenuPrimitive.Root data-slot="context-menu" {...props} />;
}

function ContextMenuTrigger({ className, ...props }: ContextMenuPrimitive.Trigger.Props) {
  return <ContextMenuPrimitive.Trigger data-slot="context-menu-trigger" className={cn("select-none", className)} {...props} />;
}

function ContextMenuContent({ className, ...props }: ContextMenuPrimitive.Popup.Props) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner className="z-50 outline-none">
        <ContextMenuPrimitive.Popup data-slot="context-menu-content" className={cn(menuPopup, className)} {...props} />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

function ContextMenuItem({
  className,
  inset,
  variant = "default",
  ...props
}: ContextMenuPrimitive.Item.Props & { inset?: boolean; variant?: "default" | "destructive" }) {
  return <ContextMenuPrimitive.Item data-slot="context-menu-item" data-variant={variant} className={cn(menuItem, inset && "pl-9", className)} {...props} />;
}

function ContextMenuCheckboxItem({ className, children, ...props }: ContextMenuPrimitive.CheckboxItem.Props) {
  return (
    <ContextMenuPrimitive.CheckboxItem data-slot="context-menu-checkbox-item" className={cn(menuItem, "pl-9", className)} {...props}>
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.CheckboxItemIndicator>
          <CheckIcon className="text-foreground!" />
        </ContextMenuPrimitive.CheckboxItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.CheckboxItem>
  );
}

function ContextMenuRadioGroup(props: ContextMenuPrimitive.RadioGroup.Props) {
  return <ContextMenuPrimitive.RadioGroup data-slot="context-menu-radio-group" {...props} />;
}

function ContextMenuRadioItem({ className, children, ...props }: ContextMenuPrimitive.RadioItem.Props) {
  return (
    <ContextMenuPrimitive.RadioItem data-slot="context-menu-radio-item" className={cn(menuItem, "pl-9", className)} {...props}>
      <span className="absolute left-2.5 flex size-4 items-center justify-center">
        <ContextMenuPrimitive.RadioItemIndicator>
          <span className="block size-2 rounded-full bg-foreground" />
        </ContextMenuPrimitive.RadioItemIndicator>
      </span>
      {children}
    </ContextMenuPrimitive.RadioItem>
  );
}

function ContextMenuGroup(props: ContextMenuPrimitive.Group.Props) {
  return <ContextMenuPrimitive.Group data-slot="context-menu-group" {...props} />;
}

function ContextMenuLabel({ className, ...props }: ContextMenuPrimitive.GroupLabel.Props) {
  return <ContextMenuPrimitive.GroupLabel data-slot="context-menu-label" className={cn("px-2.5 pt-2 pb-1 text-xs font-medium text-muted-foreground", className)} {...props} />;
}

function ContextMenuSeparator({ className, ...props }: ContextMenuPrimitive.Separator.Props) {
  return <ContextMenuPrimitive.Separator data-slot="context-menu-separator" className={cn("-mx-1.5 my-1.5 h-px bg-outline-variant", className)} {...props} />;
}

function ContextMenuShortcut({ className, ...props }: React.ComponentProps<"span">) {
  return <span data-slot="context-menu-shortcut" className={cn("ml-auto pl-4 font-mono text-[11px] tracking-wide text-muted-foreground", className)} {...props} />;
}

function ContextMenuSub(props: ContextMenuPrimitive.SubmenuRoot.Props) {
  return <ContextMenuPrimitive.SubmenuRoot data-slot="context-menu-sub" {...props} />;
}

function ContextMenuSubTrigger({ className, children, ...props }: ContextMenuPrimitive.SubmenuTrigger.Props) {
  return (
    <ContextMenuPrimitive.SubmenuTrigger data-slot="context-menu-sub-trigger" className={cn(menuItem, "data-popup-open:bg-container-high", className)} {...props}>
      {children}
      <ChevronRightIcon className="ml-auto" />
    </ContextMenuPrimitive.SubmenuTrigger>
  );
}

function ContextMenuSubContent({ className, ...props }: ContextMenuPrimitive.Popup.Props) {
  return (
    <ContextMenuPrimitive.Portal>
      <ContextMenuPrimitive.Positioner className="z-50 outline-none" side="right" align="start" sideOffset={4} alignOffset={-6}>
        <ContextMenuPrimitive.Popup data-slot="context-menu-sub-content" className={cn(menuPopup, className)} {...props} />
      </ContextMenuPrimitive.Positioner>
    </ContextMenuPrimitive.Portal>
  );
}

export {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuCheckboxItem,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubTrigger,
  ContextMenuSubContent,
};
