import { ChevronsUpDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const repos = ["@designx/ui", "@designx/tokens", "@designx/icons"];

export default function CollapsibleDemo() {
  return (
    <Collapsible className="w-full max-w-xs">
      <div className="flex items-center justify-between gap-4 px-1">
        <span className="text-sm font-medium">@mira starred 3 repositories</span>
        <CollapsibleTrigger render={<Button variant="ghost" size="icon-sm" aria-label="Toggle" />}>
          <ChevronsUpDownIcon />
        </CollapsibleTrigger>
      </div>
      <div className="mt-2 rounded-md border border-outline-variant px-4 py-2.5 font-mono text-[13px]">{repos[0]}</div>
      <CollapsibleContent className="flex flex-col gap-2 pt-2">
        {repos.slice(1).map((r) => (
          <div key={r} className="rounded-md border border-outline-variant px-4 py-2.5 font-mono text-[13px]">
            {r}
          </div>
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
