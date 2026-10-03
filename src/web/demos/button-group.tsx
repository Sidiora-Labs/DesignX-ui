import { ArchiveIcon, ChevronDownIcon, ClockIcon, ReplyIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@/components/ui/button-group";

export default function ButtonGroupDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <ButtonGroup>
        <Button variant="outline">
          <ReplyIcon /> Reply
        </Button>
        <Button variant="outline">
          <ArchiveIcon /> Archive
        </Button>
        <Button variant="outline">
          <ClockIcon /> Snooze
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button>Publish</Button>
        <ButtonGroupSeparator />
        <Button size="icon" aria-label="More options">
          <ChevronDownIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <Button variant="outline">designx.dev</Button>
      </ButtonGroup>
    </div>
  );
}
