import { PlusIcon, SettingsIcon, ShareIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function TooltipDemo() {
  return (
    <div className="flex items-center justify-center gap-3">
      <Tooltip>
        <TooltipTrigger render={<Button variant="outline">Hover me</Button>} />
        <TooltipContent>Add to library</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="tonal" size="icon" aria-label="New" />}>
          <PlusIcon />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          New file <Kbd className="ml-1.5 bg-background/15 text-background">⌘N</Kbd>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Share" />}>
          <ShareIcon />
        </TooltipTrigger>
        <TooltipContent side="right">Share</TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger render={<Button variant="ghost" size="icon" aria-label="Settings" />}>
          <SettingsIcon />
        </TooltipTrigger>
        <TooltipContent side="left">Settings</TooltipContent>
      </Tooltip>
    </div>
  );
}
