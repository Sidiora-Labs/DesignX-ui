import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function SwitchDemo() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <div className="flex items-center justify-between gap-4">
        <div className="grid gap-0.5">
          <Label htmlFor="sw-airplane">Airplane mode</Label>
          <span className="text-[13px] text-muted-foreground">Disable all wireless connections.</span>
        </div>
        <Switch id="sw-airplane" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="sw-sync">Sync across devices</Label>
        <Switch id="sw-sync" defaultChecked />
      </div>
      <div className="flex items-center justify-between gap-4">
        <Label htmlFor="sw-small">Compact</Label>
        <Switch id="sw-small" size="sm" defaultChecked />
      </div>
      <div className="flex items-center justify-between gap-4 opacity-60">
        <Label htmlFor="sw-disabled">Disabled</Label>
        <Switch id="sw-disabled" disabled />
      </div>
    </div>
  );
}
