import * as React from "react";
import { FileTextIcon, LayoutDashboardIcon, SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Kbd } from "@/components/ui/kbd";

export default function CommandDialogDemo() {
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <Button variant="tonal" onClick={() => setOpen(true)}>
        Open palette <Kbd className="bg-background">⌘J</Kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Jump to…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Pages">
            <CommandItem onSelect={() => setOpen(false)}>
              <LayoutDashboardIcon /> Dashboard
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <FileTextIcon /> Documents
            </CommandItem>
            <CommandItem onSelect={() => setOpen(false)}>
              <SettingsIcon /> Settings
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
