import { ArrowRightIcon, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ButtonDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <Button>
        Get started <ArrowRightIcon />
      </Button>
      <Button variant="tonal">
        <PlusIcon /> New project
      </Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Learn more</Button>
    </div>
  );
}
