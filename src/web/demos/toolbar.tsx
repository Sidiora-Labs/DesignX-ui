import { BoldIcon, ItalicIcon, LinkIcon, ListIcon, ListOrderedIcon, UnderlineIcon } from "lucide-react";

import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarInput, ToolbarLink, ToolbarSeparator } from "@/components/ui/toolbar";

export default function ToolbarDemo() {
  return (
    <Toolbar>
      <ToolbarGroup>
        <ToolbarButton aria-label="Bold">
          <BoldIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Italic">
          <ItalicIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Underline">
          <UnderlineIcon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarGroup>
        <ToolbarButton aria-label="Bulleted list">
          <ListIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Numbered list">
          <ListOrderedIcon />
        </ToolbarButton>
        <ToolbarButton aria-label="Insert link">
          <LinkIcon />
        </ToolbarButton>
      </ToolbarGroup>
      <ToolbarSeparator />
      <ToolbarInput aria-label="Search" placeholder="Search…" />
      <ToolbarLink href="#">Help</ToolbarLink>
    </Toolbar>
  );
}
