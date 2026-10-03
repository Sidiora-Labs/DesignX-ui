import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetClose, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export default function SheetDemo() {
  return (
    <div className="flex flex-wrap gap-2">
      {(["right", "left", "bottom"] as const).map((side) => (
        <Sheet key={side}>
          <SheetTrigger render={<Button variant="outline" className="capitalize" />}>{side}</SheetTrigger>
          <SheetContent side={side}>
            <SheetHeader>
              <SheetTitle>Edit profile</SheetTitle>
              <SheetDescription>Changes are saved to your workspace.</SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 px-6">
              <div className="grid gap-2">
                <Label htmlFor={`sh-${side}-name`}>Name</Label>
                <Input id={`sh-${side}-name`} defaultValue="Mira Chen" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor={`sh-${side}-email`}>Email</Label>
                <Input id={`sh-${side}-email`} defaultValue="mira@designx.dev" />
              </div>
            </div>
            <SheetFooter>
              <SheetClose render={<Button />}>Save changes</SheetClose>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      ))}
    </div>
  );
}
