import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function InputDemo() {
  return (
    <div className="grid w-full max-w-sm gap-5">
      <div className="grid gap-2">
        <Label htmlFor="in-email">Email</Label>
        <Input id="in-email" type="email" placeholder="you@company.com" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="in-file">Avatar</Label>
        <Input id="in-file" type="file" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="in-invalid">Invalid</Label>
        <Input id="in-invalid" aria-invalid defaultValue="not-an-email" />
      </div>
      <Input disabled placeholder="Disabled" />
    </div>
  );
}
