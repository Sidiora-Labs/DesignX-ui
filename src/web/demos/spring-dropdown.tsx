import { Copy, Pencil, Share2, Trash2 } from "lucide-react";

import SpringDropdown from "@/components/elements/spring-dropdown";

export default function SpringDropdownDemo() {
  return (
    <SpringDropdown
      items={[
        { id: "edit", label: "Edit", icon: <Pencil className="size-4" /> },
        { id: "copy", label: "Duplicate", icon: <Copy className="size-4" /> },
        { id: "share", label: "Share", icon: <Share2 className="size-4" /> },
        { id: "delete", label: "Delete", icon: <Trash2 className="size-4" /> },
      ]}
      label="Actions"
    />
  );
}
