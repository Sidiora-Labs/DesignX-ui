import { BoldIcon, BookmarkIcon, ItalicIcon, UnderlineIcon } from "lucide-react";

import { Toggle } from "@/components/ui/toggle";

export default function ToggleDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Toggle aria-label="Bold">
        <BoldIcon />
      </Toggle>
      <Toggle aria-label="Italic" defaultPressed>
        <ItalicIcon />
      </Toggle>
      <Toggle variant="outline" aria-label="Underline">
        <UnderlineIcon />
      </Toggle>
      <Toggle variant="outline" size="sm" aria-label="Bookmark">
        <BookmarkIcon /> Save
      </Toggle>
      <Toggle size="lg" disabled aria-label="Disabled">
        <BoldIcon />
      </Toggle>
    </div>
  );
}
