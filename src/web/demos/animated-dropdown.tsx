import { LogOut, Settings, User } from "lucide-react";

import DropdownMenu from "@/components/elements/animated-dropdown";
import { Button } from "@/components/ui/button";

export default function AnimatedDropdownDemo() {
  return (
    <DropdownMenu
      items={[
        { key: "profile", label: "Profile", icon: <User className="size-4" /> },
        { key: "settings", label: "Settings", icon: <Settings className="size-4" />, shortcut: "⌘," },
        { key: "sep", label: "", separator: true },
        { key: "logout", label: "Log out", icon: <LogOut className="size-4" />, variant: "destructive" },
      ]}
    >
      <Button variant="outline">My account</Button>
    </DropdownMenu>
  );
}
