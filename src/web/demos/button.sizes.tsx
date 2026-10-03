import { SettingsIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ButtonSizes() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap items-center justify-center gap-3">
        <Button size="xs">Extra small</Button>
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex items-center gap-3">
        {(["icon-xs", "icon-sm", "icon", "icon-lg"] as const).map((s) => (
          <Button key={s} size={s} variant="tonal" aria-label="Settings">
            <SettingsIcon />
          </Button>
        ))}
      </div>
    </div>
  );
}
