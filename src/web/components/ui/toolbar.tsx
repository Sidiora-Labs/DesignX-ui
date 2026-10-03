import { Toolbar as ToolbarPrimitive } from "@base-ui/react/toolbar";

import { cn } from "@/lib/utils";

function Toolbar({ className, ...props }: ToolbarPrimitive.Root.Props) {
  return (
    <ToolbarPrimitive.Root
      data-slot="toolbar"
      className={cn(
        "flex w-fit items-center gap-1 rounded-full border border-outline-variant bg-background p-1 shadow-[0_1px_2px_rgb(0_0_0/0.04)] data-[orientation=vertical]:flex-col",
        className,
      )}
      {...props}
    />
  );
}

function ToolbarGroup({ className, ...props }: ToolbarPrimitive.Group.Props) {
  return <ToolbarPrimitive.Group data-slot="toolbar-group" className={cn("flex items-center gap-0.5", className)} {...props} />;
}

const toolbarItem =
  "state-layer focus-ring inline-flex h-8 min-w-8 items-center justify-center gap-1.5 rounded-full px-2 text-[13px] font-medium text-muted-foreground transition-colors select-none hover:text-foreground data-pressed:bg-secondary data-pressed:text-foreground data-disabled:pointer-events-none data-disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0";

function ToolbarButton({ className, ...props }: ToolbarPrimitive.Button.Props) {
  return <ToolbarPrimitive.Button data-slot="toolbar-button" className={cn(toolbarItem, className)} {...props} />;
}

function ToolbarLink({ className, ...props }: ToolbarPrimitive.Link.Props) {
  return <ToolbarPrimitive.Link data-slot="toolbar-link" className={cn(toolbarItem, "px-3", className)} {...props} />;
}

function ToolbarInput({ className, ...props }: ToolbarPrimitive.Input.Props) {
  return (
    <ToolbarPrimitive.Input
      data-slot="toolbar-input"
      className={cn(
        "h-8 w-40 rounded-full bg-container px-3 text-[13px] outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/30",
        className,
      )}
      {...props}
    />
  );
}

function ToolbarSeparator({ className, ...props }: ToolbarPrimitive.Separator.Props) {
  return (
    <ToolbarPrimitive.Separator
      data-slot="toolbar-separator"
      className={cn("mx-1 h-5 w-px bg-outline-variant data-[orientation=vertical]:h-px data-[orientation=vertical]:w-5", className)}
      {...props}
    />
  );
}

export { Toolbar, ToolbarGroup, ToolbarButton, ToolbarLink, ToolbarInput, ToolbarSeparator, toolbarItem };
