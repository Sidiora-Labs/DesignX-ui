import { CalendarDaysIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";

export default function HoverCardDemo() {
  return (
    <HoverCard>
      <HoverCardTrigger href="#" className="text-sm font-medium underline underline-offset-4">
        @designx
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex gap-4">
          <Avatar className="size-11">
            <AvatarImage src="https://i.pravatar.cc/96?img=5" alt="" />
            <AvatarFallback>DX</AvatarFallback>
          </Avatar>
          <div className="grid gap-1">
            <div className="text-sm font-medium">@designx</div>
            <p className="text-[13px] text-muted-foreground">The design system teamtokens, components and motion.</p>
            <div className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
              <CalendarDaysIcon className="size-3.5" /> Joined March 2024
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
