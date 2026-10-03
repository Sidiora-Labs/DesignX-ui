import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function CheckboxDemo() {
  return (
    <div className="flex flex-col gap-5">
      <Label>
        <Checkbox defaultChecked />
        Accept terms and conditions
      </Label>
      <Label className="items-start">
        <Checkbox className="mt-0.5" />
        <span className="grid gap-1.5">
          <span>Enable notifications</span>
          <span className="text-[13px] font-normal text-muted-foreground">You can change this at any time in settings.</span>
        </span>
      </Label>
      <Label>
        <Checkbox disabled />
        Disabled
      </Label>
    </div>
  );
}
