import { Menubar as MenubarPrimitive } from "@base-ui/react/menubar";
import { Menu as MenuPrimitive } from "@base-ui/react/menu";

import { cn } from "@/lib/utils";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
} from "@/components/ui/dropdown-menu";

function Menubar({ className, ...props }: MenubarPrimitive.Props) {
  return (
    <MenubarPrimitive
      data-slot="menubar"
      className={cn("flex h-11 w-fit items-center gap-0.5 rounded-full border border-outline-variant bg-background p-1", className)}
      {...props}
    />
  );
}

function MenubarMenu(props: MenuPrimitive.Root.Props) {
  return <MenuPrimitive.Root data-slot="menubar-menu" {...props} />;
}

function MenubarTrigger({ className, ...props }: MenuPrimitive.Trigger.Props) {
  return (
    <MenuPrimitive.Trigger
      data-slot="menubar-trigger"
      className={cn(
        "focus-ring flex h-8 items-center rounded-full px-3.5 text-[13px] font-medium outline-none select-none hover:bg-container data-popup-open:bg-container-high",
        className,
      )}
      {...props}
    />
  );
}

const MenubarContent = DropdownMenuContent;
const MenubarItem = DropdownMenuItem;
const MenubarGroup = DropdownMenuGroup;
const MenubarLabel = DropdownMenuLabel;
const MenubarCheckboxItem = DropdownMenuCheckboxItem;
const MenubarRadioGroup = DropdownMenuRadioGroup;
const MenubarRadioItem = DropdownMenuRadioItem;
const MenubarSeparator = DropdownMenuSeparator;
const MenubarShortcut = DropdownMenuShortcut;
const MenubarSub = DropdownMenuSub;
const MenubarSubTrigger = DropdownMenuSubTrigger;
const MenubarSubContent = DropdownMenuSubContent;

export {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarGroup,
  MenubarLabel,
  MenubarCheckboxItem,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
};
