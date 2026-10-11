import { BookOpen } from "lucide-react";

import RichPopover from "@/components/elements/rich-popover";

export default function RichPopoverDemo() {
  return (
    <RichPopover
      actionHref="https://ui.designx.dev/docs"
      actionLabel="Read the docs"
      description="Copy-paste components built on Base UI, Tailwind and Motion."
      icon={<BookOpen className="size-4" />}
      meta="ui.designx.dev"
      title="DesignX UI"
      trigger={<span className="cursor-default font-medium underline decoration-dotted underline-offset-4">DesignX UI</span>}
    />
  );
}
