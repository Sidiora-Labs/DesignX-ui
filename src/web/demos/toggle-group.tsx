import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export default function ToggleGroupDemo() {
  return (
    <div className="flex flex-col items-center gap-5">
      <ToggleGroup defaultValue={["left"]}>
        <ToggleGroupItem value="left" aria-label="Align left">
          <AlignLeftIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="center" aria-label="Align center">
          <AlignCenterIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="right" aria-label="Align right">
          <AlignRightIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup multiple variant="outline" defaultValue={["bold"]}>
        <ToggleGroupItem value="bold" aria-label="Bold">
          <BoldIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Italic">
          <ItalicIcon />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Underline">
          <UnderlineIcon />
        </ToggleGroupItem>
      </ToggleGroup>
      <ToggleGroup size="sm" defaultValue={["week"]}>
        <ToggleGroupItem value="day" className="px-3">
          Day
        </ToggleGroupItem>
        <ToggleGroupItem value="week" className="px-3">
          Week
        </ToggleGroupItem>
        <ToggleGroupItem value="month" className="px-3">
          Month
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
}
