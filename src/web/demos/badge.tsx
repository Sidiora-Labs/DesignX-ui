import { ArrowUpRightIcon, CircleCheckIcon, SparklesIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function BadgeDemo() {
  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex flex-wrap justify-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="tonal">Tonal</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Destructive</Badge>
      </div>
      <div className="flex flex-wrap justify-center gap-2">
        <Badge variant="success">
          <CircleCheckIcon /> Verified
        </Badge>
        <Badge variant="warning">Pending</Badge>
        <Badge variant="info">
          <SparklesIcon /> New
        </Badge>
        <Badge variant="outline" className="tabular-nums">
          99+
        </Badge>
        {/* oxlint-disable-next-line jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label */}
        <Badge variant="tonal" render={<a href="#badge" />}>
          Link <ArrowUpRightIcon />
        </Badge>
      </div>
    </div>
  );
}
