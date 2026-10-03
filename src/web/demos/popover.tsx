import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverDescription, PopoverHeader, PopoverTitle, PopoverTrigger } from "@/components/ui/popover";

export default function PopoverDemo() {
  return (
    <Popover>
      <PopoverTrigger render={<Button variant="outline" />}>Dimensions</PopoverTrigger>
      <PopoverContent className="w-80">
        <PopoverHeader>
          <PopoverTitle>Dimensions</PopoverTitle>
          <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
        </PopoverHeader>
        <div className="grid gap-2.5">
          {[
            ["Width", "100%"],
            ["Max width", "640px"],
            ["Height", "auto"],
          ].map(([l, v]) => (
            <div key={l} className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor={`pop-${l}`}>{l}</Label>
              <Input id={`pop-${l}`} defaultValue={v} className="col-span-2 h-8" />
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
