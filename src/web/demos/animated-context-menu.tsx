import { Copy, Pencil, Trash2 } from "lucide-react";

import ContextMenu from "@/components/elements/animated-context-menu";

export default function AnimatedContextMenuDemo() {
  return (
    <ContextMenu
      items={[
        { key: "edit", label: "Edit", icon: <Pencil className="size-4" />, shortcut: "⌘E" },
        { key: "copy", label: "Duplicate", icon: <Copy className="size-4" />, shortcut: "⌘D" },
        { key: "sep", label: "", separator: true },
        { key: "delete", label: "Delete", icon: <Trash2 className="size-4" />, variant: "destructive" },
      ]}
    >
      <div className="grid h-40 w-72 place-items-center rounded-2xl border border-dashed text-sm text-muted-foreground">
        Right-click here
      </div>
    </ContextMenu>
  );
}
