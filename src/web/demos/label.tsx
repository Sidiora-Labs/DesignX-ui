import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LabelDemo() {
  return (
    <div className="grid w-full max-w-xs gap-6">
      <Label>
        <Checkbox />
        Remember me
      </Label>
      <div className="grid gap-2">
        <Label htmlFor="label-name">Display name</Label>
        <Input id="label-name" placeholder="Mira" />
      </div>
    </div>
  );
}
